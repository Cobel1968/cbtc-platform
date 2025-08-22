"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/ielts/results - Résultats IELTS
router.get('/results', async (req, res) => {
    try {
        const { userId } = req.query;
        const where = userId ? { userId: String(userId) } : {};
        const results = await prisma.iELTSResult.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            status: 'success',
            data: { results }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des résultats IELTS',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=ielts.js.map