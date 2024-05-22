import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

import { Server } from 'socket.io';
import { createServer } from 'node:http';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

const db = createClient({
    url: 'libsql://kind-whizzer-skivadev.turso.io',
    authToken: process.env.DB_TOKEN
});

await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,
)`)

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (data) => {
        // console.log('Message received: ' + data);
        io.emit('chat message', data);
    });
    

});



app.use(logger('dev'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
    }
);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});