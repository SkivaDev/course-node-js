import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { createClient } from "@libsql/client";

import { Server } from 'socket.io';
import { createServer } from 'node:http';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);


const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
  )
`)

io.on('connection', async (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', async (data) => {

        let result;

        try {
            result = await db.execute({
                sql: `INSERT INTO messages (content) VALUES (:content)`,
                args: { content: data }
            });
        } catch (error) {
            console.log(error);
            return;
        }

        // console.log('Message received: ' + data);
        io.emit('chat message', data, result.lastInsertRowid.toString());
    });
    
    if(!socket.recovered) {
        try {
            const results = await db.execute({
                sql: `SELECT id, content FROM messages WHERE id > ?`,
                args: [socket.handshake.auth.serverOffset ?? 0]
            });

            results.rows.forEach(row => {
                socket.emit('chat message', row.content, row.id.toString());
            })
        } catch (error) {
            console.log(error);
        }
    }

});



app.use(logger('dev'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
    }
);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});