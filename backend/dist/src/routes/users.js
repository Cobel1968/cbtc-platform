"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/users - Liste des utilisateurs avec filtres
router.get('/', async (req, res) => {
    try {
        const { role, country, isActive, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (role)
            where.role = role;
        if (country)
            where.country = country;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            enrollments: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);
        res.json({
            status: 'success',
            data: {
                users,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalUsers: total,
                    hasNextPage: skip + Number(limit) < total
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/users/:id - Profil utilisateur détaillé
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                programs: {
                    select: {
                        id: true,
                        title: true,
                        level: true
                    }
                },
                enrollments: {
                    include: {
                        program: {
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true,
                                level: true
                            }
                        }
                    }
                },
                ieltsTestResults: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }
        res.json({
            status: 'success',
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération du profil utilisateur',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map