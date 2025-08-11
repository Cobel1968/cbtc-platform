#!/bin/bash
set -e

echo "🚀 Génération de l'Architecture CBTC - Excellence Entrepreneuriale"

# Création de la structure de répertoires
mkdir -p backend/src/{routes,middleware}
mkdir -p backend/prisma
mkdir -p frontend/{app/{login,register,programs,admin},components,lib}
mkdir -p frontend/app/programs/[slug]

echo "📁 Structure de répertoires créée"

# Configuration Docker Compose
cat > docker-compose.yml << 'EOF'
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: cbtc
    ports:
      - "5432:5432"
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      PORT: ${BACKEND_PORT}
      CORS_ORIGIN: ${FRONTEND_URL}
    ports:
      - "${BACKEND_PORT}:4000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: ${BACKEND_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  dbdata:
EOF

# Configuration d'environnement
cat > .env << 'EOF'
JWT_SECRET=cbtc-excellence-entrepreneuriale-jwt-secret-2024-abel-coulibaly
DATABASE_URL=postgresql://postgres:postgres@db:5432/cbtc?schema=public
BACKEND_PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

cp .env .env.example

echo "🔧 Configuration Docker et environnement créés"

# Backend - Package.json
cat > backend/package.json << 'EOF'
{
  "name": "cbtc-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.18.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "slugify": "^1.6.6",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.14.9",
    "prisma": "^5.18.0",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4"
  }
}
EOF

# Configuration TypeScript Backend
cat > backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Dockerfile Backend
cat > backend/Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "dev"]
EOF

# Schema Prisma
cat > backend/prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
  INSTRUCTOR
}

enum ProgramStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  SUSPENDED
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         Role      @default(USER)
  profile      Profile?
  enrollments  Enrollment[]
  createdPrograms Program[] @relation("ProgramInstructor")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  isActive     Boolean   @default(true)

  @@map("users")
}

model Profile {
  id        String  @id @default(cuid())
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String  @unique
  title     String?
  bio       String?
  avatarUrl String?
  phone     String?
  website   String?
  linkedin  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("profiles")
}

model Program {
  id          String        @id @default(cuid())
  slug        String        @unique
  title       String
  description String
  shortDescription String?
  imageUrl    String?
  price       Decimal       @default(0)
  currency    String        @default("EUR")
  duration    Int?
  level       String?
  category    String?
  status      ProgramStatus @default(DRAFT)
  instructor  User          @relation("ProgramInstructor", fields: [instructorId], references: [id])
  instructorId String
  lessons     Lesson[]
  enrollments Enrollment[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("programs")
}

model Lesson {
  id        String   @id @default(cuid())
  program   Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  programId String
  title     String
  content   String
  videoUrl  String?
  duration  Int?
  order     Int
  isPublished Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("lessons")
}

model Enrollment {
  id              String           @id @default(cuid())
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId          String
  program         Program          @relation(fields: [programId], references: [id], onDelete: Cascade)
  programId       String
  status          EnrollmentStatus @default(ACTIVE)
  progress        Decimal          @default(0)
  completedAt     DateTime?
  certificateUrl  String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@unique([userId, programId])
  @@map("enrollments")
}
EOF

# Configuration Backend Core
cat > backend/src/config.ts << 'EOF'
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.jwtSecret || config.jwtSecret === 'fallback-secret') {
  console.warn('⚠️  JWT_SECRET non configuré. Utilisez une valeur sécurisée en production.');
}

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL est requis');
}
EOF

# Client Prisma
cat > backend/src/prisma.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
EOF

# Middleware d'authentification
cat > backend/src/middleware/auth.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../prisma.js';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou inactif' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};
EOF

# Routes d'authentification
cat > backend/src/routes/auth.ts << 'EOF'
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { config } from '../config.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  name: z.string().min(1, 'Le nom est requis').max(100)
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
});

router.post('/register', async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validation.error.flatten()
      });
    }

    const { email, password, name } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        profile: {
          create: {}
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      user,
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validation.error.flatten()
      });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

export default router;
EOF

# Routes utilisateurs
cat > backend/src/routes/users.ts << 'EOF'
import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profile: true,
        enrollments: {
          include: {
            program: {
              select: {
                id: true,
                title: true,
                slug: true,
                imageUrl: true
              }
            }
          }
        },
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
EOF

# Routes programmes
cat > backend/src/routes/programs.ts << 'EOF'
import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';
import slugify from 'slugify';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status === 'all' ? {} : { status: 'PUBLISHED' };

    const programs = await prisma.program.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        description: true,
        imageUrl: true,
        price: true,
        currency: true,
        duration: true,
        level: true,
        category: true,
        status: true,
        instructor: {
          select: {
            name: true,
            profile: {
              select: { title: true, avatarUrl: true }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        },
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des programmes' });
  }
});

const createProgramSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().min(0).default(0),
  currency: z.string().default('EUR'),
  duration: z.number().positive().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT')
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validation = createProgramSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: validation.error.flatten() 
      });
    }

    const data = validation.data;
    let slug = slugify(data.title, { lower: true, strict: true });
    
    let counter = 1;
    let originalSlug = slug;
    while (await prisma.program.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const program = await prisma.program.create({
      data: {
        ...data,
        slug,
        instructorId: req.user!.id
      },
      include: {
        instructor: {
          select: { name: true }
        }
      }
    });

    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ error: 'Erreur lors de la création du programme' });
  }
});

router.post('/:id/enroll', requireAuth, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      select: { id: true, title: true, status: true }
    });

    if (!program || program.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Programme non trouvé ou non disponible' });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_programId: {
          userId: req.user!.id,
          programId: req.params.id
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'Déjà inscrit à ce programme' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user!.id,
        programId: req.params.id,
        status: 'ACTIVE'
      },
      include: {
        program: {
          select: { title: true }
        }
      }
    });

    res.status(201).json({
      message: `Inscription réussie au programme "${enrollment.program.title}"`,
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling user:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

export default router;
EOF

# Routes contenu
cat > backend/src/routes/content.ts << 'EOF'
import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const createLessonSchema = z.object({
  programId: z.string().cuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  videoUrl: z.string().url().optional(),
  duration: z.number().positive().optional(),
  order: z.number().int().min(0)
});

router.post('/lessons', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validation = createLessonSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validation.error.flatten()
      });
    }

    const data = validation.data;

    const program = await prisma.program.findUnique({
      where: { id: data.programId },
      select: { id: true, title: true, instructorId: true }
    });

    if (!program) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    if (program.instructorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ce programme' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...data,
        isPublished: true
      },
      include: {
        program: {
          select: { title: true }
        }
      }
    });

    res.status(201).json({
      message: 'Leçon créée avec succès',
      lesson
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la leçon' });
  }
});

export default router;
EOF

# Serveur principal
cat > backend/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import programRoutes from './routes/programs.js';
import contentRoutes from './routes/content.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    ...(config.nodeEnv === 'development' && { details: error.message })
  });
});

const port = config.port;

app.listen(port, () => {
  console.log(`🚀 Serveur CBTC démarré sur le port ${port}`);
  console.log(`🌍 Environnement: ${config.nodeEnv}`);
  console.log(`🔗 API disponible sur: http://localhost:${port}`);
});
EOF

# Frontend - Package.json
cat > frontend/package.json << 'EOF'
{
  "name": "cbtc-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.4"
  }
}
EOF

# Configuration Next.js
cat > frontend/next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
EOF

# Configuration TypeScript Frontend
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Configuration Tailwind
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
EOF

# PostCSS Config
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Dockerfile Frontend
cat > frontend/Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF

# API Client
cat > frontend/lib/api.ts << 'EOF'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function api(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(error.error || 'Erreur API');
  }
  
  return response.json();
}
EOF

# Logo Component
cat > frontend/components/Logo.tsx << 'EOF'
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 36 36" 
          fill="none"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="url(#logoGradient)"
            stroke="white"
            strokeWidth="2"
          />
          <path 
            d="M12 18l4 4 8-8" 
            stroke="white" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle 
            cx="18" 
            cy="8" 
            r="2" 
            fill="white" 
            opacity="0.8"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          CBTC
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">
          Excellence Entrepreneuriale
        </span>
      </div>
    </div>
  );
}
EOF

# Layout Principal
cat > frontend/app/layout.tsx << 'EOF'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CBTC - Excellence Entrepreneuriale',
  description: 'Plateforme d\'apprentissage pour entrepreneurs visionnaires',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# Page d'accueil
cat > frontend/app/page.tsx << 'EOF'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur <span className="text-indigo-600">CBTC</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme d'excellence entrepreneuriale qui transforme vos visions en réalités numériques
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              🚀 Programmes d'Excellence
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos programmes de formation conçus pour les entrepreneurs visionnaires
            </p>
            <a 
              href="/programs" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explorer les Programmes
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              👤 Votre Parcours
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre compte et commencez votre transformation entrepreneuriale
            </p>
            <div className="space-y-3">
              <a 
                href="/register" 
                className="block text-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                S'inscrire
              </a>
              <a 
                href="/login" 
                className="block text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500">
            🌟 L'avenir de l'éducation entrepreneuriale commence ici
          </p>
        </div>
      </div>
    </div>
  )
}
EOF

# CSS Global
cat > frontend/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
EOF

echo ""
echo "🎉 =================================="
echo "🌟 ARCHITECTURE CBTC GÉNÉRÉE AVEC SUCCÈS !"
echo "🎉 =================================="
echo ""
echo "📁 Structure créée dans: $(pwd)"
echo "🔧 Configuration Docker prête"
echo "⚡ Backend TypeScript/Express configuré"
echo "🎨 Frontend Next.js 14 prêt"
echo "📊 Base de données PostgreSQL avec Prisma"
echo "🔐 Système d'authentification JWT"
echo ""
