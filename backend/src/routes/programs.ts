import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/programs - Liste des programmes CBTC (CORRIGÉ)
router.get('/', async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true
          }
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                icon: true
              }
            }
          }
        },
        lessons: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            caseStudies: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: {
        programs,
        total: programs.length
      },
      message: `${programs.length} programmes d'excellence CBTC trouvés`
    });
  } catch (error) {
    console.error('Erreur programmes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des programmes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/programs/:slug - Programme spécifique
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const program = await prisma.program.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            bio: true,
            role: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' }
        },
        caseStudies: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    });

    if (!program) {
      return res.status(404).json({
        status: 'error',
        message: 'Programme non trouvé'
      });
    }

    res.json({
      status: 'success',
      data: { program }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du programme',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
