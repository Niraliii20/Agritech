import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
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
const isProd = process.env.NODE_ENV === 'production';

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── CORS ─────────────────────────────────────────────────────────────────────
// In production the frontend is served by this same Express process (same
// origin), so CORS only matters for external API clients (Postman, mobile, etc.)
// We keep it permissive here; tighten origin array if you add a separate client.
const corsOptions = {
  origin: isProd
    ? (process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : true)          // true = reflect request Origin (allows same-origin)
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ── Common middleware ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(isProd ? 'combined' : 'dev'));
}

// ── Rate limiting on sensitive auth endpoints ─────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Health-check endpoint ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AgriTech - Smart Farming Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
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

// ── Serve React frontend in production ───────────────────────────────────────
// In development Vite runs on :5173 and proxies /api → :5000.
// In production we build the React app and serve its dist/ from Express.
if (isProd) {
  const distPath = path.join(__dirname, '..', 'client', 'dist');

  // Static assets (JS bundles, CSS, images, fonts …)
  app.use(express.static(distPath, { maxAge: '1y', etag: false }));

  // SPA catch-all: any non-/api path returns index.html so React Router works
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // let API 404s fall through
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Error-handling middleware ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `[AgriTech Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[AgriTech Server] SIGTERM received — shutting down gracefully');
  server.close(() => process.exit(0));
});

export default app;
