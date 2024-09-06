import express from "express";
import { PORT } from "./config.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
    }
);

app.post('/login', (req, res) => {
    res.send('Login successful!');
    }
);

app.post('/register', (req, res) => {
    res.send('Register successful!');
    }
);

app.post('/logout', (req, res) => {
    res.send('Logout successful!');
    }
);


app.get('/protected', (req, res) => {
    res.send('Protected route');
    }
);



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    }
);
