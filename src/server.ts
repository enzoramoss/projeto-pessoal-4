import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API de Tarefas (use /api/tasks)' });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Erro interno' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
