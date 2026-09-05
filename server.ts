import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { INITIAL_REPORTS } from './src/data/initialReports';
import { INITIAL_FORUM_TOPICS } from './src/data/greenEcoData';

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

  // Tabel untuk laporan warga (Report) — disimpan sebagai JSON blob
  // biar gampang reuse struktur data yang sama persis kayak di frontend
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Tabel untuk diskusi forum (ForumTopic) — sama, disimpan sebagai JSON blob
  await db.execute(`
    CREATE TABLE IF NOT EXISTS forum_topics (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  
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

  // Seeder untuk reports & forum topics (cuma jalan sekali, kalau tabel masih kosong)
  try {
    const reportsCheck = await db.execute('SELECT COUNT(*) as cnt FROM reports');
    const reportsCount = Number(reportsCheck.rows[0]?.cnt || 0);
    if (reportsCount === 0) {
      for (const report of INITIAL_REPORTS) {
        await db.execute({
          sql: 'INSERT INTO reports (id, data, created_at) VALUES (?, ?, ?)',
          args: [report.id, JSON.stringify(report), report.timestamp || Date.now()],
        });
      }
      console.log(`Seeded ${INITIAL_REPORTS.length} initial reports`);
    }
  } catch (error) {
    console.error('Failed to seed reports:', error);
  }

  try {
    const topicsCheck = await db.execute('SELECT COUNT(*) as cnt FROM forum_topics');
    const topicsCount = Number(topicsCheck.rows[0]?.cnt || 0);
    if (topicsCount === 0) {
      let i = 0;
      for (const topic of INITIAL_FORUM_TOPICS) {
        i++;
        await db.execute({
          sql: 'INSERT INTO forum_topics (id, data, created_at) VALUES (?, ?, ?)',
          args: [topic.id, JSON.stringify(topic), Date.now() - i * 1000],
        });
      }
      console.log(`Seeded ${INITIAL_FORUM_TOPICS.length} initial forum topics`);
    }
  } catch (error) {
    console.error('Failed to seed forum topics:', error);
  }
  isDbSetup = true;
};
setupDb();

const JWT_SECRET = process.env.JWT_SECRET || 'lapor-kota-super-secret-key-2026';

// Middleware: verifikasi JWT, isi req.user kalau valid.
// requireAuth() mewajibkan login, optionalAuth() cuma nambahin info user kalau ada token.
function verifyToken(req: any): { id: string; email: string; role: string } | null {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

function requireAuth(req: any, res: any, next: any) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Silakan login terlebih dahulu.' });
  }
  req.user = user;
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Silakan login terlebih dahulu.' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya petugas/admin yang dapat melakukan aksi ini.' });
  }
  req.user = user;
  next();
}

// ===================== RATE LIMITER (anti brute-force) =====================
// In-memory limiter sederhana: max N request per window per kombinasi IP.
// Cukup buat skala hackathon/single-instance; bukan pengganti Redis di production besar.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(maxRequests: number, windowMs: number) {
  return (req: any, res: any, next: any) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      const secondsLeft = Math.ceil((entry.resetAt - now) / 1000);
      return res.status(429).json({ error: `Terlalu banyak percobaan. Coba lagi dalam ${secondsLeft} detik.` });
    }

    entry.count++;
    next();
  };
}

// ===================== VALIDATION SCHEMAS (zod) =====================
const signupSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(100),
  phone: z.string().max(20).optional().nullable(),
  domicile: z.string().max(100).optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

const reportSchema = z.object({
  title: z.string().trim().min(5, 'Judul minimal 5 karakter').max(150),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter').max(2000),
  category: z.string().min(1),
  location: z.string().min(1).max(200),
}).passthrough(); // field lain (mapTopPct, imageUrl, dll) tetap diteruskan apa adanya

const commentSchema = z.object({
  content: z.string().trim().min(1, 'Komentar tidak boleh kosong').max(1000),
  userName: z.string().max(100).optional(),
});

const statusUpdateSchema = z.object({
  status: z.enum(['baru', 'diproses', 'selesai']),
  note: z.string().trim().max(1000).optional(),
});

const forumTopicSchema = z.object({
  title: z.string().trim().min(5, 'Judul minimal 5 karakter').max(150),
  content: z.string().trim().min(10, 'Isi diskusi minimal 10 karakter').max(3000),
  category: z.string().min(1),
}).passthrough();

const replySchema = z.object({
  content: z.string().trim().min(1, 'Balasan tidak boleh kosong').max(1000),
});

// Middleware generator: validasi req.body pakai skema zod, kirim 400 kalau gagal
function validateBody(schema: z.ZodTypeAny) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return res.status(400).json({ error: firstError?.message || 'Data tidak valid' });
    }
    req.body = result.data;
    next();
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Security headers dasar (setara subset helmet, tanpa nambah dependency baru)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API ROUTES
  app.post('/api/auth/signup', rateLimit(10, 15 * 60 * 1000), validateBody(signupSchema), async (req, res) => {
    await setupDb();
    try {
      const { name, email, password, phone, domicile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'usr-' + Date.now().toString();

      await db.execute({
        sql: 'INSERT INTO users (id, name, email, password, phone, domicile, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [userId, name, email, hashedPassword, phone ?? null, domicile ?? null, 'user'],
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

  app.post('/api/auth/login', rateLimit(10, 15 * 60 * 1000), validateBody(loginSchema), async (req, res) => {
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

  // ===================== REPORTS API =====================

  app.get('/api/reports', async (req, res) => {
    await setupDb();
    try {
      const result = await db.execute('SELECT data FROM reports ORDER BY created_at DESC');
      const reports = result.rows.map((row: any) => JSON.parse(row.data as string));
      res.json({ reports });
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/reports', requireAuth, validateBody(reportSchema), async (req: any, res) => {
    await setupDb();
    try {
      const id = 'rep-' + Date.now().toString().slice(-6);
      const report = { ...req.body, id, userId: req.user.id };
      await db.execute({
        sql: 'INSERT INTO reports (id, data, created_at) VALUES (?, ?, ?)',
        args: [id, JSON.stringify(report), report.timestamp || Date.now()],
      });
      res.json({ report });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  // Helper: ambil 1 report dari DB, return null kalau gak ketemu
  const getReportById = async (id: string) => {
    const result = await db.execute({ sql: 'SELECT data FROM reports WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return null;
    return JSON.parse(result.rows[0].data as string);
  };
  const saveReport = async (id: string, report: any) => {
    await db.execute({ sql: 'UPDATE reports SET data = ? WHERE id = ?', args: [JSON.stringify(report), id] });
  };

  app.post('/api/reports/:id/upvote', requireAuth, async (req: any, res) => {
    await setupDb();
    try {
      const report = await getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

      const upvotedBy: string[] = report.upvotedBy || [];
      const idx = upvotedBy.indexOf(req.user.id);
      if (idx === -1) {
        upvotedBy.push(req.user.id);
      } else {
        upvotedBy.splice(idx, 1);
      }
      report.upvotedBy = upvotedBy;
      report.upvotes = upvotedBy.length;
      await saveReport(req.params.id, report);
      res.json({ report });
    } catch (error) {
      console.error('Upvote report error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/reports/:id/status', requireAdmin, validateBody(statusUpdateSchema), async (req: any, res) => {
    await setupDb();
    try {
      const { status, note } = req.body;
      const report = await getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

      report.status = status;
      report.updates = [
        ...(report.updates || []),
        {
          id: 'upd-' + Date.now(),
          date: 'Baru saja',
          author: req.user.email,
          role: 'Petugas',
          message: note || `Status diubah menjadi ${status}`,
          statusChange: status,
        },
      ];
      await saveReport(req.params.id, report);
      res.json({ report });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/reports/:id/comment', requireAuth, validateBody(commentSchema), async (req: any, res) => {
    await setupDb();
    try {
      const { content, userName } = req.body;
      const report = await getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

      report.comments = [
        ...(report.comments || []),
        {
          id: 'c-' + Date.now(),
          userName: userName || req.user.email,
          timestamp: 'Baru saja',
          content,
          isOfficial: req.user.role === 'admin',
        },
      ];
      await saveReport(req.params.id, report);
      res.json({ report });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  // Hapus laporan — hanya boleh oleh pembuat laporan (report.userId) atau admin
  app.delete('/api/reports/:id', requireAuth, async (req: any, res) => {
    await setupDb();
    try {
      const report = await getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

      const isOwner = report.userId && report.userId === req.user.id;
      const isAdmin = req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Anda tidak berhak menghapus laporan ini.' });
      }

      await db.execute({ sql: 'DELETE FROM reports WHERE id = ?', args: [req.params.id] });
      res.json({ success: true, id: req.params.id });
    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/reports/:id/volunteer', requireAuth, async (req: any, res) => {
    await setupDb();
    try {
      const { name, role } = req.body || {};
      const report = await getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });

      report.volunteerCount = (report.volunteerCount || 0) + 1;
      report.userJoinedVolunteer = true;
      if (name && role) {
        report.comments = [
          ...(report.comments || []),
          {
            id: 'c-' + Date.now(),
            userName: `${name} (Relawan Terdaftar)`,
            timestamp: 'Baru saja',
            content: `Saya siap bergabung dalam aksi relawan sebagai ${role}! Mari gotong royong bersihkan area ini.`,
          },
        ];
      }
      await saveReport(req.params.id, report);
      res.json({ report });
    } catch (error) {
      console.error('Volunteer error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  // ===================== FORUM API =====================

  app.get('/api/forum/topics', async (req, res) => {
    await setupDb();
    try {
      const result = await db.execute('SELECT data FROM forum_topics ORDER BY created_at DESC');
      const topics = result.rows.map((row: any) => JSON.parse(row.data as string));
      res.json({ topics });
    } catch (error) {
      console.error('Get forum topics error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/forum/topics', requireAuth, validateBody(forumTopicSchema), async (req: any, res) => {
    await setupDb();
    try {
      const id = 'topic-' + Date.now().toString().slice(-6);
      const topic = { ...req.body, id, repliesCount: 0, replies: [], upvotes: 0, upvotedBy: [] };
      await db.execute({
        sql: 'INSERT INTO forum_topics (id, data, created_at) VALUES (?, ?, ?)',
        args: [id, JSON.stringify(topic), Date.now()],
      });
      res.json({ topic });
    } catch (error) {
      console.error('Create topic error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  const getTopicById = async (id: string) => {
    const result = await db.execute({ sql: 'SELECT data FROM forum_topics WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return null;
    return JSON.parse(result.rows[0].data as string);
  };
  const saveTopic = async (id: string, topic: any) => {
    await db.execute({ sql: 'UPDATE forum_topics SET data = ? WHERE id = ?', args: [JSON.stringify(topic), id] });
  };

  app.post('/api/forum/topics/:id/upvote', requireAuth, async (req: any, res) => {
    await setupDb();
    try {
      const topic = await getTopicById(req.params.id);
      if (!topic) return res.status(404).json({ error: 'Diskusi tidak ditemukan' });

      const upvotedBy: string[] = topic.upvotedBy || [];
      const idx = upvotedBy.indexOf(req.user.id);
      if (idx === -1) {
        upvotedBy.push(req.user.id);
      } else {
        upvotedBy.splice(idx, 1);
      }
      topic.upvotedBy = upvotedBy;
      topic.upvotes = upvotedBy.length;
      await saveTopic(req.params.id, topic);
      res.json({ topic });
    } catch (error) {
      console.error('Upvote topic error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/forum/topics/:id/reply', requireAuth, validateBody(replySchema), async (req: any, res) => {
    await setupDb();
    try {
      const { content } = req.body;
      const topic = await getTopicById(req.params.id);
      if (!topic) return res.status(404).json({ error: 'Diskusi tidak ditemukan' });

      const reply = {
        id: 'reply-' + Date.now(),
        author: req.user.email,
        role: 'Warga',
        avatarInitials: req.user.email.slice(0, 2).toUpperCase(),
        timestamp: 'Baru saja',
        content,
        upvotes: 0,
        upvotedBy: [],
      };
      topic.replies = [...(topic.replies || []), reply];
      topic.repliesCount = topic.replies.length;
      await saveTopic(req.params.id, topic);
      res.json({ topic });
    } catch (error) {
      console.error('Add reply error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
  });

  app.post('/api/forum/topics/:topicId/replies/:replyId/upvote', requireAuth, async (req: any, res) => {
    await setupDb();
    try {
      const topic = await getTopicById(req.params.topicId);
      if (!topic) return res.status(404).json({ error: 'Diskusi tidak ditemukan' });

      topic.replies = (topic.replies || []).map((r: any) => {
        if (r.id !== req.params.replyId) return r;
        const upvotedBy: string[] = r.upvotedBy || [];
        const idx = upvotedBy.indexOf(req.user.id);
        if (idx === -1) {
          upvotedBy.push(req.user.id);
        } else {
          upvotedBy.splice(idx, 1);
        }
        return { ...r, upvotedBy, upvotes: upvotedBy.length };
      });
      await saveTopic(req.params.topicId, topic);
      res.json({ topic });
    } catch (error) {
      console.error('Upvote reply error:', error);
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
