import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import callRoutes from './routes/callRoute';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calls', callRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
