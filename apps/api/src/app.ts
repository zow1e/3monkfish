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
  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/owners', ownersRouter);
  app.use('/pets', petsRouter);
  app.use('/appointments', appointmentsRouter);
  app.use('/reminders', remindersRouter);
  app.use('/chat', chatRouter);
  app.use('/knowledge-base', knowledgeBaseRouter);
  app.use('/listings', listingsRouter);
  app.use('/api/listings', listingsRouter);
  app.use('/ingestion', ingestionRouter);
  return app;
};
