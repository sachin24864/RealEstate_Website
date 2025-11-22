import { createServer } from 'http';
import './app/config/env.js';
import mongoose from './app/config/mongoose.js';
import app from './app/index.js';

const server = createServer(app);

const startServer = async () => {
  try {
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.info(`Server started on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default server;
