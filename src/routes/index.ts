import { Router, Request, Response } from 'express';
import * as fm from '../fileManager';

const router = Router();

router.get('/tasks', async (req: Request, res: Response) => {
  const q = (req.query.q as string | undefined)?.toLowerCase() || '';
  const tasks = await fm.readTasks();
  const filtered = q ? tasks.filter(t => t.title.toLowerCase().includes(q)) : tasks;
  res.json({ ok: true, data: filtered });
});

router.get('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });
  const t = await fm.getTaskById(id);
  if (!t) return res.status(404).json({ ok: false, error: 'Tarefa não encontrada' });
  res.json({ ok: true, data: t });
});

router.post('/tasks', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title || typeof title !== 'string') return res.status(400).json({ ok: false, error: 'title é obrigatório' });
  const t = await fm.addTask({ title, description });
  res.status(201).json({ ok: true, data: t });
});

router.put('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });
  const { title, description, done } = req.body;
  const updated = await fm.updateTask(id, { title, description, done });
  if (!updated) return res.status(404).json({ ok: false, error: 'Tarefa não encontrada' });
  res.json({ ok: true, data: updated });
});

router.delete('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ ok: false, error: 'ID inválido' });
  const ok = await fm.deleteTask(id);
  if (!ok) return res.status(404).json({ ok: false, error: 'Tarefa não encontrada' });
  res.json({ ok: true, message: 'Tarefa removida' });
});

export default router;