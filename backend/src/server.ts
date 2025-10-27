import 'dotenv/config';
import http from 'http';
import app from './app';
import { initSocket, setIo } from './sockets';
import { connectDb } from './config/db';

const PORT = process.env.PORT || 4000;

const start = async (): Promise<void> => {
  try {
    await connectDb();

    const server = http.createServer(app);
    const io = initSocket(server);
    setIo(io);

    server.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Fatal start error:', error);
    process.exit(1);
  }
};

start();
