// CBTC POS Cash Payment Service - Système de Caisse Corporate
// Abel Coulibaly - Excellence Comptable

export interface POSPaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  customerName: string;
  programTitle: string;
  cashierName: string;
  terminalId: string;
  location: string;
}

export interface POSPaymentResponse {
  success: boolean;
  receiptNumber?: string;
  receiptUrl?: string;
  invoiceNumber?: string;
  message?: string;
  error?: string;
}

export interface POSReceipt {
  receiptNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    id: string;
  };
  transaction: {
    amount: number;
    currency: string;
    program: string;
  };
  terminal: {
    id: string;
    location: string;
    cashier: string;
  };
  company: {
    name: string;
    logo: string;
    address: string;
    phone: string;
  };
}

export class POSPaymentService {
  private readonly companyInfo = {
    name: 'CBTC Platform',
    fullName: 'Cobel Business Training Center',
    logo: '/logo-cbtc.svg',
    address: 'Abidjan, Côte d\'Ivoire',
    phone: '+2250555007884',
    email: 'abel@cobelbtc.com',
    website: 'https://app.cobelbtc.com',
    director: 'Abel Coulibaly'
  };

  /**
   * Process POS Cash Payment
   * Traitement paiement comptoir avec reçu
   */
  async processCashPayment(request: POSPaymentRequest): Promise<POSPaymentResponse> {
    try {
      console.log('💵 POS Cash Payment Processing:', {
        terminal: request.terminalId,
        location: request.location,
        amount: request.amount,
        customer: request.customerName
      });

      // Generate receipt number
      const receiptNumber = this.generateReceiptNumber(request.terminalId);
      const invoiceNumber = this.generateInvoiceNumber();
      
      // Create receipt data
      const receipt = this.createReceiptData(request, receiptNumber, invoiceNumber);
      
      // Generate receipt PDF/HTML
      const receiptUrl = await this.generateReceipt(receipt);
      
      console.log('✅ POS Receipt Generated:', receiptNumber);
      
      return {
        success: true,
        receiptNumber,
        receiptUrl,
        invoiceNumber,
        message: `Paiement comptoir confirmé. Reçu: ${receiptNumber}`
      };
      
    } catch (error) {
      console.error('🚨 POS Payment Error:', error);
      
      return {
        success: false,
        error: 'Erreur système POS'
      };
    }
  }

  /**
   * Generate Receipt Number
   * Format: CBTC-YYYYMMDD-TERMINAL-SEQUENCE
   */
  private generateReceiptNumber(terminalId: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `CBTC-${dateStr}-${terminalId}-${sequence}`;
  }

  /**
   * Generate Invoice Number
   * Format: INV-CBTC-YYYYMMDD-SEQUENCE
   */
  private generateInvoiceNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    
    return `INV-CBTC-${dateStr}-${sequence}`;
  }

  /**
   * Create Receipt Data Structure
   */
  private createReceiptData(request: POSPaymentRequest, receiptNumber: string, invoiceNumber: string): POSReceipt {
    const now = new Date();
    
    return {
      receiptNumber,
      date: now.toLocaleDateString('fr-FR'),
      time: now.toLocaleTimeString('fr-FR'),
      customer: {
        name: request.customerName,
        id: request.customerId
      },
      transaction: {
        amount: request.amount,
        currency: request.currency,
        program: request.programTitle
      },
      terminal: {
        id: request.terminalId,
        location: request.location,
        cashier: request.cashierName
      },
      company: this.companyInfo
    };
  }

  /**
   * Generate Receipt HTML/PDF
   */
  private async generateReceipt(receipt: POSReceipt): Promise<string> {
    const receiptHtml = this.createReceiptHTML(receipt);
    
    // In production, you would:
    // 1. Convert HTML to PDF using puppeteer or similar
    // 2. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 3. Return public URL
    
    // For now, return a simulated URL
    const receiptUrl = `/receipts/${receipt.receiptNumber}.pdf`;
    
    console.log('📄 Receipt HTML generated for:', receipt.receiptNumber);
    
    return receiptUrl;
  }

  /**
   * Create Professional Receipt HTML
   */
  private createReceiptHTML(receipt: POSReceipt): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu CBTC - ${receipt.receiptNumber}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .receipt { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 5px; }
        .company-info { font-size: 12px; color: #666; line-height: 1.4; }
        .receipt-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .receipt-number { font-size: 16px; font-weight: bold; color: #1e40af; }
        .section { margin: 20px 0; }
        .section-title { font-weight: bold; color: #374151; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { color: #6b7280; }
        .detail-value { font-weight: 500; color: #111827; }
        .amount { font-size: 20px; font-weight: bold; color: #059669; text-align: center; background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        .signature { margin-top: 40px; text-align: center; }
        .signature-line { border-top: 1px solid #000; width: 200px; margin: 30px auto 10px; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">🎓 CBTC PLATFORM</div>
            <div class="company-info">
                <strong>${receipt.company.fullName}</strong><br>
                ${receipt.company.address}<br>
                📞 ${receipt.company.phone}<br>
                ✉️ ${receipt.company.email}<br>
                🌐 ${receipt.company.website}
            </div>
        </div>

        <div class="receipt-info">
            <div class="receipt-number">REÇU N° ${receipt.receiptNumber}</div>
            <div style="margin-top: 10px;">
                <strong>Date:</strong> ${receipt.date} à ${receipt.time}
            </div>
        </div>

        <div class="section">
            <div class="section-title">👤 INFORMATIONS CLIENT</div>
            <div class="detail-row">
                <span class="detail-label">Nom:</span>
                <span class="detail-value">${receipt.customer.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">ID Client:</span>
                <span class="detail-value">${receipt.customer.id}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🎓 FORMATION</div>
            <div class="detail-row">
                <span class="detail-label">Programme:</span>
                <span class="detail-value">${receipt.transaction.program}</span>
            </div>
        </div>

        <div class="amount">
            💰 MONTANT PAYÉ<br>
            <span style="font-size: 24px;">${receipt.transaction.amount.toLocaleString()} ${receipt.transaction.currency}</span>
        </div>

        <div class="section">
            <div class="section-title">🏪 TERMINAL DE PAIEMENT</div>
            <div class="detail-row">
                <span class="detail-label">Terminal:</span>
                <span class="detail-value">${receipt.terminal.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Localisation:</span>
                <span class="detail-value">${receipt.terminal.location}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Caissier:</span>
                <span class="detail-value">${receipt.terminal.cashier}</span>
            </div>
        </div>

        <div class="signature">
            <div class="signature-line"></div>
            <div>Signature Caissier</div>
        </div>

        <div class="footer">
            <strong>Merci pour votre confiance en CBTC Platform!</strong><br>
            Directeur: ${receipt.company.director}<br>
            Excellence Entrepreneuriale & Formation IELTS<br><br>
            
            📱 Support Client: ${receipt.company.phone}<br>
            🌐 Plateforme: ${receipt.company.website}
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Validate POS Terminal
   */
  validateTerminal(terminalId: string, location: string): boolean {
    // Add your terminal validation logic
    const validTerminals = ['CBTC-001', 'CBTC-002', 'CBTC-MOBILE-01'];
    return validTerminals.includes(terminalId);
  }

  /**
   * Get Daily Cash Summary
   */
  async getDailyCashSummary(terminalId: string, date: string) {
    // This would query your database for daily cash transactions
    return {
      terminalId,
      date,
      totalTransactions: 0,
      totalAmount: 0,
      currency: 'XOF'
    };
  }
}

export const posPaymentService = new POSPaymentService();
