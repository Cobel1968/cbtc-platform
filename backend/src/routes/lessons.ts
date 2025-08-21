import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/lessons - Liste des leçons par programme
router.get('/', async (req, res) => {
try {
    const { programId, isPublished } = req.query;

    const where: any = {};
    if (programId) where.programId = String(programId);
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';

    const lessons = await prisma.lesson.findMany({
    where,
    include: {
        program: {
        select: {
            id: true,
            title: true,
            slug: true
        }
        },
        _count: {
        select: {
            progress: true
}
    },
    orderBy: [
        { programId: 'asc' },
        { order: 'asc' }
    ]
    });

    res.json({
    status: 'success',
    data: {
        lessons,
        total: lessons.length
    },
    message: `${lessons.length} leçons d'excellence trouvées`
    });
} catch (error) {
    res.status(500).json({
    status: 'error',
    message: 'Erreur lors de la récupération des leçons',
    error: error instanceof Error ? error.message : 'Unknown error'
    });
}
});

// GET /api/lessons/:id - Leçon spécifique avec progression
router.get('/:id', async (req, res) => {
try {
    const { id } = req.params;
    const { userId } = req.query;

    const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
        program: {
        select: {
            id: true,
            title: true,
            slug: true,
            level: true
        }
        },
        progress: userId ? {
        where: { userId: String(userId) }
        } : undefined,
        _count: {
        select: {
            progress: true
        }
        }
    }
    });

    if (!lesson) {
    return res.status(404).json({
        status: 'error',
        message: 'Leçon non trouvée'
    });
    }

    res.json({
    status: 'success',
    data: { lesson }
    });
} catch (error) {
    res.status(500).json({
    status: 'error',
    message: 'Erreur lors de la récupération de la leçon',
    error: error instanceof Error ? error.message : 'Unknown error'
    });
}
});

// POST /api/lessons - Créer une nouvelle leçon (Instructors/Admin)
router.post('/', async (req, res) => {
try {
    const {
    title,
    content,
summary,
    programId,
    order,
    duration,
    videoUrl,
    audioUrl,
    isPublished = false,
    isFree = false
    } = req.body;

    // Validation basique
    if (!title || !programId || order === undefined) {
    return res.status(400).json({
        status: 'error',
        message: 'Titre, programme et ordre sont requis'
    });
    }

    const lesson = await prisma.lesson.create({
    data: {
        title,
        content,
        summary,
        programId,
        order: parseInt(order),
        duration: duration ? parseInt(duration) : null,
        videoUrl,
        audioUrl,
        isPublished,
        isFree
    },
    include: {
        program: {
        select: {
            title: true,
            slug: true
        }
        }
    }
    });

    res.status(201).json({
    status: 'success',
    data: { lesson },
    message: 'Leçon créée avec excellence !'
    });
} catch (error) {
    res.status(500).json({
    status: 'error',
    message: 'Erreur lors de la création de la leçon',
    error: error instanceof Error ? error.message : 'Unknown error'
    });
}
});

// PUT /api/lessons/:id - Mettre à jour une leçon
router.put('/:id', async (req, res) => {
try {
    const { id } = req.params;
    const updateData = req.body;

    const lesson = await prisma.lesson.update({
    where: { id },
    data: {
        ...updateData,
        order: updateData.order ? parseInt(updateData.order) : undefined,
        duration: updateData.duration ? parseInt(updateData.duration) : undefined,
        updatedAt: new Date()
    },
    include: {
        program: {
        select: {
            title: true,
            slug: true
        }
        }
    }
    });

    res.json({
    status: 'success',
    data: { lesson },
    message: 'Leçon mise à jour avec excellence !'
    });
} catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
    return res.status(404).json({
        status: 'error',
        message: 'Leçon non trouvée'
    });
    }

    res.status(500).json({
    status: 'error',
    message: 'Erreur lors de la mise à jour de la leçon',
    error: error instanceof Error ? error.message : 'Unknown error'
    });
}
});

// DELETE /api/lessons/:id - Supprimer une leçon
router.delete('/:id', async (req, res) => {
try {
    const { id } = req.params;

    await prisma.lesson.delete({
    where: { id }
    });

    res.json({
    status: 'success',
    message: 'Leçon supprimée avec succès'
    });
} catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
    return res.status(404).json({
        status: 'error',
        message: 'Leçon non trouvée'
    });
    }

    res.status(500).json({
    status: 'error',
    message: 'Erreur lors de la suppression de la leçon',
    error: error instanceof Error ? error.message : 'Unknown error'
    });
}
});

export default router;
