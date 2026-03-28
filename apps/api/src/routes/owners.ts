import { Router } from 'express';

export const ownersRouter = Router();

ownersRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'owners', status: 'ok', todo: 'Implement controller/service wiring.' });
});
