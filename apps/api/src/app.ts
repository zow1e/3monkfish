import express from 'express';
import { healthRouter } from './routes/health';
import { ownersRouter } from './routes/owners';
import { petsRouter } from './routes/pets';
import { appointmentsRouter } from './routes/appointments';
import { remindersRouter } from './routes/reminders';
import { chatRouter } from './routes/chat';
import { knowledgeBaseRouter } from './routes/knowledgeBase';
import { listingsRouter } from './routes/listings';
import { ingestionRouter } from './routes/ingestion';

export const createApp = () => {
  const app = express();
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });
  app.use(express.json());
  app.use('/health', healthRouter);
  /** Same health check under `/api/*` so Vite proxy `/api` can reach it. */
  app.use('/api/health', healthRouter);
  app.use('/owners', ownersRouter);
  app.use('/pets', petsRouter);
  app.use('/appointments', appointmentsRouter);
  app.use('/reminders', remindersRouter);
  /** RAG chat — also under `/api/chat` so Vite can proxy `/api/*` without path rewriting. */
  app.use('/api/chat', chatRouter);
  app.use('/chat', chatRouter);
  app.use('/knowledge-base', knowledgeBaseRouter);
  app.use('/listings', listingsRouter);
  app.use('/api/listings', listingsRouter);
  app.use('/ingestion', ingestionRouter);
  return app;
};
