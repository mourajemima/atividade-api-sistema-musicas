const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();

const jwtScret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const users = [];

app.post('/registro', (req, res) => {
    const {email, password} = req.body;
    const user = {email, password};
    users.push(user);
    res.status(201).send('Usuário registrado.');
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign({email}, jwtScret, {expiresIn: '1h'});
        return res.json({token});
    }
    res.status(401).send('Credenciais inválidas.');
});

const autenticarJWT = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(403).send('Token não fornecido.');

    try {
        const dados = jwt.verify(token, jwtScret);
        req.users = dados;
        next();
    } catch (error) {
        res.status(400).send('Token inválido.');
    }   
};

app.get('/musicas', autenticarJWT, (req, res) => {
    res.json([
        { id: 1, titulo: 'Música A', artista: 'DJ A' }, 
        { id: 2, titulo: 'Música B', artista: 'DJ B' }
    ]);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000.');
});