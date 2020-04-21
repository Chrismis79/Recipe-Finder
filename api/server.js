const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/restricted-middleware');
const authRouter = require('../auth/auth-router');


const userRouter = require('../users/users-router');


const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up", dbenv: process.env.DB_ENV });
  });

server.use('/api/auth', authRouter);

server.use('/api/users', authenticate, userRouter);

module.exports = server;