// CBTC Payment Routes - Gestion Financière Excellence
// Abel Coulibaly - Système de Paiement Intégré

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { wavePaymentService } from '../services/wavePayment.js';
import { posPaymentService } from '../services/posPayment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Validation Schemas
const wavePaymentSchema = z.object({
  programId: z.string(),
  customerPhone: z.string().regex(/^\+225[0-9]{8,10}$/, 'Numéro Wave invalide'),
  amount: z.number().min(1000, 'Montant minimum: 1000 XOF')
});

const posPaymentSchema = z.object({
  programId: z.string(),
  amount: z.number().min(1000, 'Montant minimum: 1000 XOF'),
  customerName: z.string().min(1, 'Nom client requis'),
  cashierName: z.string().min(1, 'Nom caissier requis'),
  terminalId: z.string().min(1, 'ID terminal requis'),
  location: z.string().min(1, 'Localisation requise')
});

/**
 * POST /api/payments/wave/initiate
 * Initiate Wave Mobile Payment
 */
router.post('/wave/initiate', authenticateToken, async (req, res) => {
  try {
    const validation = wavePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validation.error.flatten()
      });
    }

    const { programId, customerPhone, amount } = validation.data;
    const userId = req.user.id;

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true, price: true }
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Programme introuvable'
      });
    }

    // Create enrollment record
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        programId,
        paymentStatus: 'PENDING',
        paymentMethod: 'WAVE_MOBILE',
        paymentAmount: amount
      }
    });

    // Initiate Wave payment
    const waveResult = await wavePaymentService.initiatePayment({
      amount,
      currency: 'XOF',
      customerPhone,
      description: `Formation CBTC: ${program.title}`,
      orderId: enrollment.id
    });

    if (waveResult.success) {
      // Create payment record
      await prisma.payment.create({
        data: {
          userId,
          enrollmentId: enrollment.id,
          amount,
          currency: 'XOF',
          paymentMethod: 'WAVE_MOBILE',
          paymentStatus: 'PROCESSING',
          transactionType: 'ENROLLMENT',
          waveTransactionId: waveResult.transactionId,
          wavePhoneNumber: '+2250555007884', // CBTC Wave number
          waveCustomerPhone: customerPhone,
          waveReference: waveResult.reference
        }
      });

      // Generate payment instructions
      const instructions = wavePaymentService.generatePaymentInstructions(amount, enrollment.id);

      res.json({
        success: true,
        message: 'Paiement Wave initié',
        transactionId: waveResult.transactionId,
        reference: waveResult.reference,
        instructions,
        enrollmentId: enrollment.id
      });
    } else {
      // Update enrollment status
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paymentStatus: 'FAILED' }
      });

      res.status(400).json({
        success: false,
        error: waveResult.error
      });
    }

  } catch (error) {
    console.error('Wave Payment Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur Wave'
    });
  }
});

/**
 * POST /api/payments/wave/verify
 * Verify Wave Payment Status
 */
router.post('/wave/verify', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'ID transaction requis'
      });
    }

    // Verify with Wave
    const verification = await wavePaymentService.verifyPayment(transactionId);

    if (verification.success && verification.status === 'COMPLETED') {
      // Update payment and enrollment status
      const payment = await prisma.payment.findFirst({
        where: { waveTransactionId: transactionId },
        include: { enrollment: true }
      });

      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              paymentStatus: 'COMPLETED',
              confirmedAt: new Date()
            }
          }),
          prisma.enrollment.update({
            where: { id: payment.enrollmentId! },
            data: {
              paymentStatus: 'COMPLETED',
              paymentDate: new Date()
            }
          })
        ]);

        res.json({
          success: true,
          message: 'Paiement Wave confirmé',
          status: 'COMPLETED'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Transaction introuvable'
        });
      }
    } else {
      res.json({
        success: false,
        message: verification.message || 'Paiement en attente',
        status: verification.status
      });
    }

  } catch (error) {
    console.error('Wave Verification Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur vérification Wave'
    });
  }
});

/**
 * POST /api/payments/pos/cash
 * Process POS Cash Payment
 */
router.post('/pos/cash', authenticateToken, async (req, res) => {
  try {
    const validation = posPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validation.error.flatten()
      });
    }

    const { programId, amount, customerName, cashierName, terminalId, location } = validation.data;
    const userId = req.user.id;

    // Verify terminal
    if (!posPaymentService.validateTerminal(terminalId, location)) {
      return res.status(400).json({
        success: false,
        error: 'Terminal POS non autorisé'
      });
    }

    // Verify program
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true, price: true }
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Programme introuvable'
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        programId,
        paymentStatus: 'COMPLETED', // Cash is immediate
        paymentMethod: 'CASH_POS',
        paymentAmount: amount,
        paymentDate: new Date()
      }
    });

    // Process POS payment
    const posResult = await posPaymentService.processCashPayment({
      amount,
      currency: 'XOF',
      customerId: userId,
      customerName,
      programTitle: program.title,
      cashierName,
      terminalId,
      location
    });

    if (posResult.success) {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId,
          enrollmentId: enrollment.id,
          amount,
          currency: 'XOF',
          paymentMethod: 'CASH_POS',
          paymentStatus: 'COMPLETED',
          transactionType: 'ENROLLMENT',
          posReceiptNumber: posResult.receiptNumber,
          posTerminalId: terminalId,
          posCashierName: cashierName,
          posLocation: location,
          receiptUrl: posResult.receiptUrl,
          invoiceNumber: posResult.invoiceNumber,
          processedAt: new Date(),
          confirmedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Paiement comptoir confirmé',
        receiptNumber: posResult.receiptNumber,
        receiptUrl: posResult.receiptUrl,
        invoiceNumber: posResult.invoiceNumber,
        enrollmentId: enrollment.id,
        paymentId: payment.id
      });
    } else {
      // Rollback enrollment
      await prisma.enrollment.delete({
        where: { id: enrollment.id }
      });

      res.status(500).json({
        success: false,
        error: posResult.error
      });
    }

  } catch (error) {
    console.error('POS Payment Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur système POS'
    });
  }
});

/**
 * GET /api/payments/user/:userId
 * Get User Payment History
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user access (admin or own data)
    if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé'
      });
    }

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        enrollment: {
          include: {
            program: {
              select: { title: true, slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.paymentMethod,
        status: payment.paymentStatus,
        program: payment.enrollment?.program?.title,
        date: payment.createdAt,
        receiptUrl: payment.receiptUrl,
        receiptNumber: payment.posReceiptNumber || payment.waveTransactionId
      }))
    });

  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur récupération historique'
    });
  }
});

/**
 * GET /api/payments/financial/summary
 * Financial Management Dashboard (Admin Only)
 */
router.get('/financial/summary', authenticateToken, async (req, res) => {
  try {
    // Admin only
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Accès administrateur requis'
      });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Daily summary
    const dailyStats = await prisma.payment.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
        createdAt: { gte: startOfDay }
      },
      _sum: { amount: true },
      _count: { id: true }
    });

    // Monthly summary
    const monthlyStats = await prisma.payment.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true },
      _count: { id: true }
    });

    // Payment method breakdown
    const methodBreakdown = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        paymentStatus: 'COMPLETED',
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true },
      _count: { id: true }
    });

    res.json({
      success: true,
      summary: {
        daily: {
          total: dailyStats._sum.amount || 0,
          transactions: dailyStats._count || 0,
          currency: 'XOF'
        },
        monthly: {
          total: monthlyStats._sum.amount || 0,
          transactions: monthlyStats._count || 0,
          currency: 'XOF'
        },
        methods: methodBreakdown.map(method => ({
          method: method.paymentMethod,
          total: method._sum.amount || 0,
          transactions: method._count || 0
        }))
      }
    });

  } catch (error) {
    console.error('Financial Summary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur rapport financier'
    });
  }
});

export default router;
