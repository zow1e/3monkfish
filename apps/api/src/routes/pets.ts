import { Router } from 'express';

export const petsRouter = Router();

petsRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'pets', status: 'ok', todo: 'Implement controller/service wiring.' });
});
