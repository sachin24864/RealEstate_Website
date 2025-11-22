import path from 'path';
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: (origin, cb) => cb(null, origin || true),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/', router);

app.use((error, req, res, next) => {
  console.error('Error middleware:', error);

  if (error.code === 11000) {
    return res.status(400).json({ error: 'Duplicate key error in database' });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

export default app;
