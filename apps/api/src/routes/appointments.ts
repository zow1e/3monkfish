import { Router } from 'express';

export const appointmentsRouter = Router();

appointmentsRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'appointments', status: 'ok', todo: 'Implement controller/service wiring.' });
});
