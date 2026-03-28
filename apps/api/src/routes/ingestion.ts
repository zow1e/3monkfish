import { Router } from 'express';

export const ingestionRouter = Router();

ingestionRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'ingestion', status: 'ok', todo: 'Implement controller/service wiring.' });
});
