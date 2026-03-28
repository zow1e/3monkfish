import { Router } from 'express';
import { z } from 'zod';
import { runRagAnswer } from '@petcare/rag-answer';

const bodySchema = z.object({
  message: z.string().min(1).max(12000),
  petId: z.string().uuid().optional().nullable(),
});

export const chatRouter = Router();

chatRouter.get('/', async (_req, res) => {
  res.status(200).json({
    route: 'chat',
    status: 'ok',
    post: 'POST JSON { message, petId? } to this URL for a RAG answer.',
  });
});

chatRouter.post('/', async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() });
  }

  try {
    const answer = await runRagAnswer(parsed.data.message, parsed.data.petId ?? null);
    return res.json({ answer });
  } catch (e) {
    console.error('[chat]', e);
    if (e instanceof z.ZodError) {
      return res.status(503).json({
        error:
          'RAG environment is not configured. Set OPENAI_API_KEY and DATABASE_URL in the repo root .env and restart the API.',
        details: e.flatten(),
      });
    }
    const msg = e instanceof Error ? e.message : 'RAG request failed';
    return res.status(500).json({ error: msg });
  }
});
