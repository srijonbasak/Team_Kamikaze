const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');
const cors    = require('cors');

const { log } = require('./core/logger');
const CFG = require('./core/config');

const chatRoutes   = require('./routes/chatRoutes');
const traceRoutes  = require('./routes/traceRoutes');
const streamRoutes = require('./routes/streamRoutes');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5173' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

// API routes only (no HTML served from backend)
app.use('/api', chatRoutes);
app.use('/api', traceRoutes);
app.use('/api', streamRoutes);

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8081);
app.listen(PORT, HOST, () => {
  log('server.started', { url: `http://${HOST}:${PORT}` });
});

module.exports = app;
