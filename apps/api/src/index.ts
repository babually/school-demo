import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

app.use('/*', cors());

// Types
type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
};

// In-memory storage (replace with actual database in production)
let students: Student[] = [];

// Validation schemas
const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  grade: z.string()
});

// Routes
app.get('/api/students', (c) => {
  return c.json(students);
});

app.get('/api/students/:id', (c) => {
  const id = c.req.param('id');
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  return c.json(student);
});

app.post('/api/students', zValidator('json', studentSchema), async (c) => {
  const body = await c.req.json();
  const newStudent: Student = {
    id: crypto.randomUUID(),
    ...body
  };
  
  students.push(newStudent);
  return c.json(newStudent, 201);
});

app.put('/api/students/:id', zValidator('json', studentSchema), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  students[index] = { ...students[index], ...body };
  return c.json(students[index]);
});

app.delete('/api/students/:id', (c) => {
  const id = c.req.param('id');
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  students = students.filter(s => s.id !== id);
  return c.json({ message: 'Student deleted successfully' });
});

export default app;