import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
    }
);

app.post('/login', (req, res) => {
    res.send('Login successful!');
    }
);

app.post('/register', (req, res) => {

    const { username, password } = req.body;

    try {
        const id = UserRepository.create({ username, password });
        res.send(`User created with id: ${id}`);
    } catch (error) {
        res.status(400).send(error.message);
    }

});

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
