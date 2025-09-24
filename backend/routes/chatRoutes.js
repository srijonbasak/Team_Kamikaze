const { Router } = require('express');
const chat = require('../controllers/chatController');

const r = Router();
r.get('/chat',  chat.handleChat);
r.post('/chat', chat.handleChat);
r.post('/direct-intent', chat.handleDirectIntent);

module.exports = r;
