import { promises as fs } from 'fs';
import path from 'path';
import { Task } from './Task';

const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'tasks.json');

async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export async function readTasks(): Promise<Task[]> {
  await ensureDataFileExists();
  const txt = await fs.readFile(DATA_FILE, 'utf-8');
  const arr = JSON.parse(txt) as Task[];
  return arr.map(a => new Task(a.id, a.title, a.description ?? null, a.done ?? false, a.createdAt ?? new Date().toISOString()));
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  await ensureDataFileExists();
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

export async function addTask({ title, description }: { title: string; description?: string | null }): Promise<Task> {
  const tasks = await readTasks();
  const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const t = new Task(nextId, title, description ?? null, false);
  tasks.push(t);
  await writeTasks(tasks);
  return t;
}

export async function getTaskById(id: number): Promise<Task | null> {
  const tasks = await readTasks();
  return tasks.find(t => t.id === id) ?? null;
}

export async function updateTask(id: number, { title, description, done }: Partial<{ title: string; description: string | null; done: boolean }>): Promise<Task | null> {
  const tasks = await readTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const task = tasks[idx];
  task.update({ title, description, done });
  await writeTasks(tasks);
  return task;
}

export async function deleteTask(id: number): Promise<boolean> {
  const tasks = await readTasks();
  const newTasks = tasks.filter(t => t.id !== id);
  if (newTasks.length === tasks.length) return false;
  await writeTasks(newTasks);
  return true;
}