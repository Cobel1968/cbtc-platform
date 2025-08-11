require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ 
  log: ['warn', 'error'],
  errorFormat: 'pretty'
});

async function monitorPerformance() {
  console.log('⚡ MONITORING PERFORMANCE CBTC - Excellence Éducative');
  console.log('====================================================');
  
  try {
    // Test de connectivité initial
    console.log('🔗 Connexion à votre plateforme éducative...');
    await prisma.$connect();
    console.log('✅ Connexion Prisma établie avec succès !');
    
    const globalStart = Date.now();
    
    // Test 1: Comptage des entités (requêtes légères)
    console.log('\n📊 Test 1: Comptage des Entités');
    const countStart = Date.now();
    const [userCount, programCount, lessonCount, enrollmentCount, profileCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.program.count().catch(() => 0),
      prisma.lesson.count().catch(() => 0),
      prisma.enrollment.count().catch(() => 0),
      prisma.profile.count().catch(() => 0)
    ]);
    const countTime = Date.now() - countStart;
    console.log(`   Comptages effectués en ${countTime}ms`);
    
    // Test 2: Requêtes avec relations (si données disponibles)
    console.log('\n🏗️  Test 2: Requêtes Relationnelles');
    const relationStart = Date.now();
    
    if (userCount > 0) {
      const usersWithProfiles = await prisma.user.findMany({ 
        take: 10,
        include: { profile: true }
      });
      console.log(`   ${usersWithProfiles.length} utilisateurs avec profils chargés`);
    }
    
    if (programCount > 0) {
      const programsWithLessons = await prisma.program.findMany({ 
        take: 10,
        include: { lessons: true }
      });
      console.log(`   ${programsWithLessons.length} programmes avec leçons chargés`);
    }
    
    if (enrollmentCount > 0) {
      const enrollmentsWithDetails = await prisma.enrollment.findMany({
        take: 10,
        include: { 
          user: { include: { profile: true } },
          program: true
        }
      });
      console.log(`   ${enrollmentsWithDetails.length} inscriptions détaillées chargées`);
    }
    
    const relationTime = Date.now() - relationStart;
    console.log(`   Requêtes relationnelles effectuées en ${relationTime}ms`);
    
    // Calcul de la performance globale
    const totalTime = Date.now() - globalStart;
    
    console.log('\n🎯 RÉSULTATS DE PERFORMANCE');
    console.log('===========================');
    console.log(`⏱️  Temps total: ${totalTime}ms`);
    console.log(`📊 Temps comptages: ${countTime}ms`);
    console.log(`🔗 Temps relations: ${relationTime}ms`);
    
    // Évaluation de la performance
    if (totalTime < 100) {
      console.log('🚀 EXCELLENT - Architecture ultra-optimisée !');
      console.log('   Votre plateforme est prête pour des milliers d\'utilisateurs');
    } else if (totalTime < 300) {
      console.log('✅ TRÈS BON - Performance satisfaisante');
      console.log('   Excellente base pour votre croissance entrepreneuriale');
    } else if (totalTime < 1000) {
      console.log('⚠️  BON - Performance acceptable');
      console.log('   Considérez des optimisations pour une croissance importante');
    } else {
      console.log('🔧 À OPTIMISER - Performance à améliorer');
    }
    
    // Statistiques de votre plateforme éducative
    console.log('\n📈 STATISTIQUES DE VOTRE PLATEFORME');
    console.log('===================================');
    console.log(`👥 Utilisateurs: ${userCount}`);
    console.log(`👤 Profils: ${profileCount}`);
    console.log(`📚 Programmes: ${programCount}`);
    console.log(`📝 Leçons: ${lessonCount}`);
    console.log(`🎓 Inscriptions: ${enrollmentCount}`);
    
    if (userCount > 0 && enrollmentCount > 0) {
      const engagementRate = (enrollmentCount / userCount * 100).toFixed(1);
      console.log(`🎯 Taux d'engagement: ${engagementRate}%`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du monitoring:', error.message);
    
    if (error.message.includes('database file') || error.message.includes('SQLITE_CANTOPEN')) {
      console.log('\n💡 DIAGNOSTIC: Problème d\'accès à la base de données');
      console.log('🔧 SOLUTION: Créez d\'abord votre base de données avec:');
      console.log('   npx prisma migrate dev --name "init_cbtc"');
      console.log('   ou npx prisma db push --force-reset');
    } else if (error.code?.startsWith('P')) {
      console.log('\n💡 DIAGNOSTIC: Erreur Prisma -', error.code);
      console.log('🔧 SOLUTION: Vérifiez votre schéma et migrations');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Monitoring terminé - Connexion fermée');
  }
}

// Exécution du monitoring
monitorPerformance().catch((error) => {
  console.error('💥 Erreur fatale:', error.message);
  process.exit(1);
});
