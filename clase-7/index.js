import express from "express";
import { PORT } from "./config.js";
import UserRepository from "./user-repository.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
    }
);

app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        // const token = UserRepository.login({ username, password });
        // res.send(`Login successful! Token: ${token}`);

        const user = await UserRepository.login({ username, password });

        res.send({ user });
    }
    catch (error) {
        res.status(400).send(error.message);
    }

});

app.post('/register',async (req, res) => {

    const { username, password } = req.body;

    try {
        const id = await UserRepository.create({ username, password });
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
