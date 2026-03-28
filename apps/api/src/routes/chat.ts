import { Router } from 'express';

export const chatRouter = Router();

chatRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'chat', status: 'ok', todo: 'Implement controller/service wiring.' });
});
