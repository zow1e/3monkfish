import { Router } from 'express';

export const knowledgeBaseRouter = Router();

knowledgeBaseRouter.get('/', async (_req, res) => {
  res.status(200).json({ route: 'knowledgeBase', status: 'ok', todo: 'Implement controller/service wiring.' });
});
