import { Router } from 'express';

export const listingsRouter = Router();

listingsRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'listings', status: 'ok', todo: 'Implement controller/service wiring.' });
});
