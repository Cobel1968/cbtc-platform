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
