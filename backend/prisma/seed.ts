import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
console.log('🌱 CBTC Excellence - Ensemencement...');

try {
    // Nettoyage
    console.log('🧹 Nettoyage de la base...');
    await prisma.lessonProgress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.caseStudy.deleteMany();
    await prisma.programCategory.deleteMany();
    await prisma.program.deleteMany();
    await prisma.category.deleteMany();
    await prisma.iELTSTestResult.deleteMany();
    await prisma.user.deleteMany();

    // Utilisateurs
    console.log('👥 Création utilisateurs...');
    const abel = await prisma.user.create({
    data: {
        email: 'abel@cbtc.dev',
        name: 'Abel Coulibaly',
        role: 'ADMIN',
        bio: 'Fondateur CBTC - Visionnaire de l\'excellence entrepreneuriale',
        country: 'Côte d\'Ivoire',
        city: 'Abidjan',
        isVerified: true,
        isActive: true,
        preferredLanguage: 'fr'
    }
    });

    const sarah = await prisma.user.create({
    data: {
        email: 'sarah@cbtc.dev',
        name: 'Dr. Sarah Johnson',
        role: 'INSTRUCTOR',
        bio: 'Expert Leadership & Innovation - Harvard Business School',
        country: 'Canada',
        city: 'Toronto',
        isVerified: true,
        isActive: true
    }
    });

    const emily = await prisma.user.create({
    data: {
        email: 'emily@cbtc.dev',
        name: 'Dr. Emily Watson',
        role: 'INSTRUCTOR',
        bio: 'IELTS Master Trainer - Cambridge Certified',
        country: 'United Kingdom',
        city: 'London',
        isVerified: true,
        isActive: true
    }
    });

    const kofi = await prisma.user.create({
    data: {
        email: 'kofi@cbtc.dev',
        name: 'Kofi Asante',
        role: 'STUDENT',
        bio: 'Entrepreneur émergent passionné d\'excellence',
        country: 'Ghana',
        city: 'Accra',
        isVerified: true,
        isActive: true
    }
    });

    // Catégories
    console.log('📂 Création catégories...');
    const leadership = await prisma.category.create({
    data: {
        name: 'Leadership Excellence',
        slug: 'leadership-excellence',
        description: 'Développer les compétences de leadership entrepreneurial',
        color: '#FF6B35',
        icon: '👑',
        order: 1,
        isActive: true
    }
    });

    const innovation = await prisma.category.create({
    data: {
        name: 'Innovation Strategy',
        slug: 'innovation-strategy',
        description: 'Maîtriser les stratégies d\'innovation disruptive',
        color: '#4ECDC4',
        icon: '💡',
        order: 2,
        isActive: true
    }
    });

    const ielts = await prisma.category.create({
    data: {
        name: 'IELTS Mastery',
        slug: 'ielts-mastery',
        description: 'Excellence anglophone pour leaders internationaux',
        color: '#F7931E',
        icon: '🎯',
        order: 3,
        isActive: true
    }
    });

    // Programmes
    console.log('🎓 Création programmes...');
    const program1 = await prisma.program.create({
    data: {
        slug: 'entrepreneur-starter-excellence',
        title: 'Entrepreneur Starter Excellence',
        subtitle: 'Votre rampe de lancement vers l\'excellence',
        description: 'Programme fondamental pour transformer votre vision en empire entrepreneurial',
        price: 299.00,
        currency: 'USD',
        duration: 8,
        level: 'BEGINNER',
        published: true,
        maxStudents: 50,
        currentStudents: 12,
        authorId: sarah.id,
        publishedAt: new Date()
    }
    });

    const program2 = await prisma.program.create({
    data: {
        slug: 'leadership-transformation-mastery',
        title: 'Leadership Transformation Mastery',
        subtitle: 'De Manager à Visionnaire',
        description: 'Maîtrise avancée du leadership transformationnel',
        price: 799.00,
        currency: 'USD',
        duration: 12,
        level: 'ADVANCED',
        published: true,
        maxStudents: 25,
        currentStudents: 8,
        authorId: sarah.id,
        publishedAt: new Date()
    }
    });

    const program3 = await prisma.program.create({
    data: {
        slug: 'ielts-excellence-pathway',
        title: 'IELTS Excellence Pathway',
        subtitle: 'Score 8.5+ Garanti',
        description: 'Votre chemin royal vers l\'excellence IELTS',
        price: 499.00,
        currency: 'USD',
        duration: 10,
        level: 'INTERMEDIATE',
        published: true,
        maxStudents: 30,
        currentStudents: 15,
        authorId: emily.id,
        publishedAt: new Date()
    }
    });

    // Relations
    console.log('🔗 Création relations...');
    await prisma.programCategory.create({
    data: { programId: program1.id, categoryId: leadership.id }
    });

    await prisma.programCategory.create({
    data: { programId: program2.id, categoryId: innovation.id }
    });

    await prisma.programCategory.create({
    data: { programId: program3.id, categoryId: ielts.id }
    });

    // Leçons
    console.log('📚 Création leçons...');
    await prisma.lesson.createMany({
    data: [
        {
        title: 'Introduction au Leadership Entrepreneurial',
        content: 'Découvrez les fondamentaux du leadership selon Abel Coulibaly',
        summary: 'Les bases du leadership entrepreneurial',
        programId: program1.id,
        order: 1,
        duration: 45,
        isPublished: true,
        isFree: true
        },
        {
        title: 'Vision et Stratégie d\'Excellence',
        content: 'Comment développer une vision entrepreneuriale transformatrice',
        summary: 'Créer sa vision d\'excellence',
        programId: program1.id,
        order: 2,
        duration: 60,
        isPublished: true
        },
        {
        title: 'IELTS Listening Mastery',
        content: 'Techniques avancées pour exceller au IELTS Listening',
        summary: 'Maîtrise de l\'écoute IELTS',
        programId: program3.id,
        order: 1,
        duration: 90,
        isPublished: true,
        isFree: true
        }
    ]
    });

    console.log('✅ SUCCÈS COMPLET !');
    console.log(`👥 4 Utilisateurs créés (Abel + équipe)`);
    console.log(`📂 3 Catégories d'excellence`);
    console.log(`🎓 3 Programmes révolutionnaires`);
    console.log(`📚 3 Leçons transformatrices`);
    console.log('🌟 Écosystème CBTC opérationnel !');

} catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
}
}

main()
.catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
