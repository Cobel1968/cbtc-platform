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
