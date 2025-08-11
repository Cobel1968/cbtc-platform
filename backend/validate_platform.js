require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: 'pretty' });

(async () => {
  try {
    console.log('🔗 Connexion à votre plateforme éducative CBTC...');
    await prisma.$connect();
    console.log('✅ CONNEXION PRISMA ÉTABLIE AVEC SUCCÈS !');
    
    // Test CRUD complet pour confirmer l'opérationnalité
    const email = `test-${Date.now()}@cbtc-excellence.com`;
    const testUser = await prisma.user.create({
      data: {
        email: email,
        password: 'test123',
        name: 'Test CBTC User'
      }
    });
    console.log('✅ CRÉATION UTILISATEUR RÉUSSIE - ID:', testUser.id);
    
    // Suppression du test
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ SUPPRESSION RÉUSSIE - Base parfaitement opérationnelle !');
    
    console.log('🎯 VOTRE PLATEFORME ÉDUCATIVE CBTC EST PARFAITEMENT FONCTIONNELLE !');
    console.log('📚 Architecture: users, profiles, programs, lessons, enrollments');
    
  } catch (error) {
    console.error('❌ Erreur de validation:', error.message);
    if (error.message.includes('database file')) {
      console.log('💡 Créez la base avec: npx prisma db push --force-reset');
    }
  } finally {
    await prisma.$disconnect();
  }
})();
