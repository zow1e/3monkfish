import { Router } from 'express';

export const remindersRouter = Router();

remindersRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'reminders', status: 'ok', todo: 'Implement controller/service wiring.' });
});
