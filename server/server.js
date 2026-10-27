import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes         from './routes/authRoutes.js';
import farmRoutes         from './routes/farmRoutes.js';
import cropRoutes         from './routes/cropRoutes.js';
import weatherRoutes      from './routes/weatherRoutes.js';
import soilRoutes         from './routes/soilRoutes.js';
import pestRoutes         from './routes/pestRoutes.js';
import productRoutes      from './routes/productRoutes.js';
import orderRoutes        from './routes/orderRoutes.js';
import expertRoutes       from './routes/expertRoutes.js';
import communityRoutes    from './routes/communityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes        from './routes/adminRoutes.js';

dotenv.config();

// ES-module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;

// Determine if a production build exists on disk
// (works regardless of whether NODE_ENV is set on the host)
const distPath   = path.join(__dirname, '..', 'client', 'dist');
const distExists = fs.existsSync(path.join(distPath, 'index.html'));

console.log('[AgriTech] dist path:', distPath);
console.log('[AgriTech] dist exists:', distExists);
console.log('[AgriTech] NODE_ENV:', process.env.NODE_ENV || 'not set');

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,          // reflect request Origin — safe since we check JWT on every protected route
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ── Common middleware ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes.' },
});
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Health-check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AgriTech - Smart Farming Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    distExists,
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/farms',         farmRoutes);
app.use('/api/crops',         cropRoutes);
app.use('/api/weather',       weatherRoutes);
app.use('/api/soil',          soilRoutes);
app.use('/api/pest',          pestRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/experts',       expertRoutes);
app.use('/api/community',     communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// ── Serve React frontend ──────────────────────────────────────────────────────
// We check if client/dist/index.html exists rather than relying on NODE_ENV.
// This means it works on Render even if NODE_ENV is not explicitly set.
if (distExists) {
  // Static assets — JS, CSS, images, fonts
  app.use(express.static(distPath, { maxAge: '1d' }));

  // SPA catch-all: all non-/api routes return index.html (React Router handles them)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // API 404s fall through to notFound
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // No build found — running in local dev mode (Vite serves the frontend on :5173)
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'AgriTech API is running. Frontend is served by Vite on http://localhost:5173 in development.',
      docs: '/api/health',
    });
  });
}

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AgriTech Server] Listening on port ${PORT}`);
});

export default app;
