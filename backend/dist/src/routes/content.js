"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const auth_js_1 = require("../middleware/auth.js");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createLessonSchema = zod_1.z.object({
    programId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(200),
    content: zod_1.z.string().min(1),
    videoUrl: zod_1.z.string().url().optional(),
    duration: zod_1.z.number().positive().optional(),
    order: zod_1.z.number().int().min(0)
});
router.post('/lessons', auth_js_1.requireAuth, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const validation = createLessonSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Données invalides',
                details: validation.error.flatten()
            });
        }
        const data = validation.data;
        const program = await prisma_js_1.prisma.program.findUnique({
            where: { id: data.programId },
            select: { id: true, title: true, instructorId: true }
        });
        if (!program) {
            return res.status(404).json({ error: 'Programme non trouvé' });
        }
        if (program.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ce programme' });
        }
        const lesson = await prisma_js_1.prisma.lesson.create({
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
    }
    catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la leçon' });
    }
});
exports.default = router;
//# sourceMappingURL=content.js.map