import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initialize SQLite DB
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let isDbSetup = false;

// Setup tables

const setupDb = async () => {
  if (isDbSetup) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      domicile TEXT,
      role TEXT DEFAULT 'user'
    );
  `);

  // Migration guard: tambahin kolom yang mungkin belum ada
  // di tabel users yang sudah exist dari deploy sebelumnya.
  const ensureColumn = async (columnDef: string) => {
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN ${columnDef}`);
    } catch (e: any) {
      // Abaikan kalau errornya emang karena kolom udah ada
      if (!e.message?.includes('duplicate column')) {
        console.error(`Migration warning for "${columnDef}":`, e.message);
      }
    }
  };
  await ensureColumn('phone TEXT');
  await ensureColumn('domicile TEXT');
  
    // Seeder for Admin
  try {
    const adminEmail = 'admin@mail.com';
    const adminCheck = await db.execute("SELECT * FROM users WHERE email = 'admin@mail.com'");
    if (adminCheck.rows.length === 0) {
      // Use standard hashing with the environment variable
      const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || '12345678';
      const hashedAdminPassword = await bcrypt.hash(adminPass, 10);
      await db.execute({
        sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
        args: ["admin-1", "Administrator", adminEmail, hashedAdminPassword, "admin"]
      });
      console.log("Admin account ready: admin@mail.com");
    } else {
      console.log("Admin account already exists, skipping");
    }
  } catch (error) {
    console.error("Failed to seed admin account:", error);
  }
  isDbSetup = true;
};
setupDb();

const JWT_SECRET = process.env.JWT_SECRET || 'lapor-kota-super-secret-key-2026';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API ROUTES
  app.post('/api/auth/signup', async (req, res) => {
    await setupDb();
    try {
      const { name, email, password, phone, domicile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'usr-' + Date.now().toString();

      await db.execute({
        sql: 'INSERT INTO users (id, name, email, password, phone, domicile, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [userId, name, email, hashedPassword, phone, domicile, 'user'],
      });

      const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ token, user: { id: userId, name, email, role: 'user', phone, domicile } });
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email sudah terdaftar' });
      } else {
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      }
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    await setupDb();
    try {
      const { email, password } = req.body;
      
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      });
      
      const user = result.rows[0];
      if (!user) {
        console.log("Login failed: User not found for email/username:", email);

        return res.status(401).json({ error: 'Email atau password salah' });
      }

      const isMatch = await bcrypt.compare(password, user.password as string);
      if (!isMatch) {
        console.log("Login failed: Password mismatch for user:", email);

        return res.status(401).json({ error: 'Email atau password salah' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          phone: user.phone, 
          domicile: user.domicile 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
