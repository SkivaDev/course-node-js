import express from "express";
import jwt from "jsonwebtoken";
import { PORT, SECRET_JWT_KEY } from "./config.js";
import UserRepository from "./user-repository.js";

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());

app.get("/", (req, res) => {
    res.render('index');
});

app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        // const token = UserRepository.login({ username, password });
        // res.send(`Login successful! Token: ${token}`);

        const user = await UserRepository.login({ username, password });
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, {
            expiresIn: '1h'
        });

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
