"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 ============================================');
    console.log('   CBTC Excellence - Ensemencement Complet');
    console.log('   Architecte: Abel Coulibaly');
    console.log('🌱 ============================================\n');
    try {
        // ========================================
        // PHASE 1: NETTOYAGE COMPLET
        // ========================================
        console.log('🧹 Phase 1: Nettoyage de la base de données...');
        await prisma.lessonProgress.deleteMany();
        console.log('   ✅ Progression leçons supprimée');
        await prisma.enrollment.deleteMany();
        console.log('   ✅ Inscriptions supprimées');
        await prisma.lesson.deleteMany();
        console.log('   ✅ Leçons supprimées');
        await prisma.caseStudy.deleteMany();
        console.log('   ✅ Études de cas supprimées');
        await prisma.programCategory.deleteMany();
        console.log('   ✅ Relations programme-catégorie supprimées');
        await prisma.program.deleteMany();
        console.log('   ✅ Programmes supprimés');
        await prisma.category.deleteMany();
        console.log('   ✅ Catégories supprimées');
        await prisma.iELTSTestResult.deleteMany();
        console.log('   ✅ Résultats IELTS supprimés');
        await prisma.user.deleteMany();
        console.log('   ✅ Utilisateurs supprimés\n');
        // ========================================
        // PHASE 2: CRÉATION DES UTILISATEURS
        // ========================================
        console.log('👥 Phase 2: Création des utilisateurs d\'excellence...');
        const abel = await prisma.user.create({
            data: {
                email: 'abel@cbtc.dev',
                name: 'Abel Coulibaly',
                role: 'ADMIN',
                bio: 'Fondateur CBTC - Visionnaire de l\'excellence entrepreneuriale depuis 1968. Architecte de la transformation pédagogique africaine.',
                country: 'Côte d\'Ivoire',
                city: 'Abidjan',
                phone: '+225-XX-XX-XX-XX',
                isVerified: true,
                isActive: true,
                preferredLanguage: 'fr'
            }
        });
        console.log('   ✅ Abel Coulibaly (Fondateur/Admin) créé');
        const sarah = await prisma.user.create({
            data: {
                email: 'sarah@cbtc.dev',
                name: 'Dr. Sarah Johnson',
                role: 'INSTRUCTOR',
                bio: 'Expert Leadership & Innovation - Harvard Business School Alumni. 15 ans d\'expérience en transformation entrepreneuriale.',
                country: 'Canada',
                city: 'Toronto',
                phone: '+1-416-XXX-XXXX',
                isVerified: true,
                isActive: true,
                preferredLanguage: 'en'
            }
        });
        console.log('   ✅ Dr. Sarah Johnson (Leadership Expert) créée');
        const emily = await prisma.user.create({
            data: {
                email: 'emily@cbtc.dev',
                name: 'Dr. Emily Watson',
                role: 'INSTRUCTOR',
                bio: 'IELTS Master Trainer - Cambridge Certified. Spécialiste score 8.5+ pour leaders internationaux.',
                country: 'United Kingdom',
                city: 'London',
                phone: '+44-20-XXXX-XXXX',
                isVerified: true,
                isActive: true,
                preferredLanguage: 'en'
            }
        });
        console.log('   ✅ Dr. Emily Watson (IELTS Expert) créée');
        const kofi = await prisma.user.create({
            data: {
                email: 'kofi@cbtc.dev',
                name: 'Kofi Asante',
                role: 'STUDENT',
                bio: 'Entrepreneur émergent passionné d\'excellence. Future star de l\'innovation africaine.',
                country: 'Ghana',
                city: 'Accra',
                phone: '+233-XX-XXX-XXXX',
                isVerified: true,
                isActive: true,
                preferredLanguage: 'en'
            }
        });
        console.log('   ✅ Kofi Asante (Étudiant modèle) créé\n');
        // ========================================
        // PHASE 3: CATÉGORIES D'EXCELLENCE
        // ========================================
        console.log('📂 Phase 3: Création des catégories d\'excellence...');
        const leadership = await prisma.category.create({
            data: {
                name: 'Leadership Excellence',
                slug: 'leadership-excellence',
                description: 'Développer les compétences de leadership entrepreneurial de classe mondiale',
                color: '#FF6B35',
                icon: '👑',
                order: 1,
                isActive: true
            }
        });
        console.log('   ✅ Leadership Excellence créée');
        const innovation = await prisma.category.create({
            data: {
                name: 'Innovation Strategy',
                slug: 'innovation-strategy',
                description: 'Maîtriser les stratégies d\'innovation disruptive et transformation digitale',
                color: '#4ECDC4',
                icon: '💡',
                order: 2,
                isActive: true
            }
        });
        console.log('   ✅ Innovation Strategy créée');
        const digitalTransfo = await prisma.category.create({
            data: {
                name: 'Digital Transformation',
                slug: 'digital-transformation',
                description: 'Piloter la révolution digitale entrepreneuriale avec excellence',
                color: '#45B7D1',
                icon: '🚀',
                order: 3,
                isActive: true
            }
        });
        console.log('   ✅ Digital Transformation créée');
        const ielts = await prisma.category.create({
            data: {
                name: 'IELTS Mastery',
                slug: 'ielts-mastery',
                description: 'Excellence anglophone pour leaders internationaux - Score 8.5+ garanti',
                color: '#F7931E',
                icon: '🎯',
                order: 4,
                isActive: true
            }
        });
        console.log('   ✅ IELTS Mastery créée\n');
        // ========================================
        // PHASE 4: PROGRAMMES RÉVOLUTIONNAIRES
        // ========================================
        console.log('🎓 Phase 4: Création des programmes révolutionnaires...');
        const program1 = await prisma.program.create({
            data: {
                slug: 'entrepreneur-starter-excellence',
                title: 'Entrepreneur Starter Excellence',
                subtitle: 'Votre rampe de lancement vers l\'excellence entrepreneuriale',
                description: 'Programme fondamental pour transformer votre vision en empire entrepreneurial. Méthodes éprouvées par Abel Coulibaly, testées sur le terrain africain.',
                content: 'Contenu révolutionnaire alliant théorie avancée et pratique immersive. 8 semaines de transformation complète avec mentorat personnalisé.',
                price: 299.00,
                currency: 'USD',
                duration: 8,
                level: 'BEGINNER',
                published: true,
                thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
                videoIntro: 'https://example.com/intro-starter.mp4',
                maxStudents: 50,
                currentStudents: 12,
                authorId: sarah.id,
                publishedAt: new Date()
            }
        });
        console.log('   ✅ Entrepreneur Starter Excellence créé');
        const program2 = await prisma.program.create({
            data: {
                slug: 'leadership-transformation-mastery',
                title: 'Leadership Transformation Mastery',
                subtitle: 'De Manager à Visionnaire - Transformation Complète',
                description: 'Maîtrise avancée du leadership transformationnel. Créez des équipes d\'exception et inspirez le changement à l\'échelle continentale.',
                content: 'Méthodologie exclusive de transformation leadership. 12 semaines d\'immersion totale dans l\'excellence avec cas pratiques réels.',
                price: 799.00,
                currency: 'USD',
                duration: 12,
                level: 'ADVANCED',
                published: true,
                thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
                videoIntro: 'https://example.com/intro-leadership.mp4',
                maxStudents: 25,
                currentStudents: 8,
                authorId: sarah.id,
                publishedAt: new Date()
            }
        });
        console.log('   ✅ Leadership Transformation Mastery créé');
        const program3 = await prisma.program.create({
            data: {
                slug: 'ielts-excellence-pathway',
                title: 'IELTS Excellence Pathway',
                subtitle: 'Score 8.5+ Garanti - Méthode Révolutionnaire',
                description: 'Votre chemin royal vers l\'excellence IELTS. Technique exclusive pour leaders internationaux qui visent l\'excellence absolue.',
                content: 'Stratégies secrètes des top performers IELTS. 10 semaines de préparation intensive sur-mesure avec simulations réelles.',
                price: 499.00,
                currency: 'USD',
                duration: 10,
                level: 'INTERMEDIATE',
                published: true,
                thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
                videoIntro: 'https://example.com/intro-ielts.mp4',
                maxStudents: 30,
                currentStudents: 15,
                authorId: emily.id,
                publishedAt: new Date()
            }
        });
        console.log('   ✅ IELTS Excellence Pathway créé');
        const program4 = await prisma.program.create({
            data: {
                slug: 'digital-transformation-accelerator',
                title: 'Digital Transformation Accelerator',
                subtitle: 'Révolution Digitale pour Entrepreneurs Visionnaires',
                description: 'Accélérez votre transformation digitale avec les dernières innovations technologiques et stratégiques.',
                content: 'Programme intensif de 6 semaines pour maîtriser les outils digitaux révolutionnaires.',
                price: 599.00,
                currency: 'USD',
                duration: 6,
                level: 'EXPERT',
                published: true,
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
                maxStudents: 20,
                currentStudents: 5,
                authorId: abel.id,
                publishedAt: new Date()
            }
        });
        console.log('   ✅ Digital Transformation Accelerator créé\n');
        // ========================================
        // PHASE 5: RELATIONS PROGRAMME-CATÉGORIE
        // ========================================
        console.log('🔗 Phase 5: Création des relations programme-catégorie...');
        await prisma.programCategory.create({
            data: { programId: program1.id, categoryId: leadership.id }
        });
        await prisma.programCategory.create({
            data: { programId: program2.id, categoryId: innovation.id }
        });
        await prisma.programCategory.create({
            data: { programId: program3.id, categoryId: ielts.id }
        });
        await prisma.programCategory.create({
            data: { programId: program4.id, categoryId: digitalTransfo.id }
        });
        console.log('   ✅ Relations programme-catégorie établies\n');
        // ========================================
        // PHASE 6: LEÇONS D'EXCELLENCE
        // ========================================
        console.log('📚 Phase 6: Création des leçons d\'excellence...');
        // Leçons Programme 1 (Entrepreneur Starter)
        await prisma.lesson.createMany({
            data: [
                {
                    title: 'Introduction au Leadership Entrepreneurial',
                    content: 'Découvrez les fondamentaux du leadership selon Abel Coulibaly. Une vision transformatrice pour l\'Afrique.',
                    summary: 'Les bases du leadership entrepreneurial africain',
                    programId: program1.id,
                    order: 1,
                    duration: 45,
                    videoUrl: 'https://example.com/lesson1-video.mp4',
                    isPublished: true,
                    isFree: true
                },
                {
                    title: 'Vision et Stratégie d\'Excellence',
                    content: 'Comment développer une vision entrepreneuriale transformatrice qui impacte des millions de vies.',
                    summary: 'Créer sa vision d\'excellence entrepreneuriale',
                    programId: program1.id,
                    order: 2,
                    duration: 60,
                    videoUrl: 'https://example.com/lesson2-video.mp4',
                    isPublished: true,
                    isFree: false
                },
                {
                    title: 'Construire son Empire Entrepreneurial',
                    content: 'Stratégies pratiques pour bâtir une entreprise durable et impactante.',
                    summary: 'Architecture d\'un empire entrepreneurial',
                    programId: program1.id,
                    order: 3,
                    duration: 75,
                    videoUrl: 'https://example.com/lesson3-video.mp4',
                    isPublished: true,
                    isFree: false
                }
            ]
        });
        // Leçons Programme 2 (Leadership Mastery)
        await prisma.lesson.createMany({
            data: [
                {
                    title: 'Leadership Transformationnel Avancé',
                    content: 'Techniques avancées pour inspirer et transformer les équipes à grande échelle.',
                    summary: 'Maîtrise du leadership transformationnel',
                    programId: program2.id,
                    order: 1,
                    duration: 90,
                    videoUrl: 'https://example.com/leadership1-video.mp4',
                    isPublished: true,
                    isFree: false
                },
                {
                    title: 'Gestion de Crise et Résilience',
                    content: 'Comment naviguer les tempêtes entrepreneuriales avec excellence et sortir plus fort.',
                    summary: 'Excellence dans la gestion de crise',
                    programId: program2.id,
                    order: 2,
                    duration: 80,
                    videoUrl: 'https://example.com/leadership2-video.mp4',
                    isPublished: true,
                    isFree: false
                }
            ]
        });
        // Leçons Programme 3 (IELTS Excellence)
        await prisma.lesson.createMany({
            data: [
                {
                    title: 'IELTS Listening Mastery',
                    content: 'Techniques avancées pour exceller au IELTS Listening. Stratégies des top performers mondiaux.',
                    summary: 'Maîtrise de l\'écoute IELTS niveau excellence',
                    programId: program3.id,
                    order: 1,
                    duration: 90,
                    videoUrl: 'https://example.com/ielts1-video.mp4',
                    audioUrl: 'https://example.com/ielts1-audio.mp3',
                    isPublished: true,
                    isFree: true
                },
                {
                    title: 'IELTS Speaking Excellence - Score 9',
                    content: 'Secrets pour atteindre le score parfait en expression orale IELTS.',
                    summary: 'Expression orale IELTS niveau excellence',
                    programId: program3.id,
                    order: 2,
                    duration: 85,
                    videoUrl: 'https://example.com/ielts2-video.mp4',
                    isPublished: true,
                    isFree: false
                },
                {
                    title: 'IELTS Writing Task 2 - Argumentation Parfaite',
                    content: 'Maîtrisez l\'art de l\'argumentation écrite pour impressionner les examinateurs.',
                    summary: 'Écriture IELTS niveau excellence',
                    programId: program3.id,
                    order: 3,
                    duration: 95,
                    videoUrl: 'https://example.com/ielts3-video.mp4',
                    isPublished: true,
                    isFree: false
                }
            ]
        });
        console.log('   ✅ 8 leçons d\'excellence créées\n');
        // ========================================
        // PHASE 7: ÉTUDES DE CAS INSPIRANTES
        // ========================================
        console.log('💼 Phase 7: Création des études de cas inspirantes...');
        await prisma.caseStudy.createMany({
            data: [
                {
                    title: 'Success Story: De l\'idée au Million - Kofi Tech Empire',
                    subtitle: 'Comment un étudiant CBTC a révolutionné l\'AgriTech en Afrique',
                    content: 'L\'histoire inspirante de la transformation d\'une simple idée en empire technologique générant des millions.',
                    summary: 'Cas d\'étude AgriTech révolutionnaire',
                    industry: 'AgriTech',
                    company: 'Kofi Tech Empire',
                    tags: '["innovation", "agriculture", "technologie", "afrique"]',
                    difficulty: 'Medium',
                    readTime: 15,
                    views: 234,
                    programId: program1.id,
                    publishedAt: new Date()
                },
                {
                    title: 'Leadership Crisis: Naviguer la Pandémie avec Excellence',
                    subtitle: 'Stratégies de leadership en temps de crise mondiale',
                    content: 'Analyse détaillée des décisions de leadership qui ont sauvé des entreprises durant COVID-19.',
                    summary: 'Leadership de crise niveau excellence',
                    industry: 'Leadership',
                    company: 'Multiple',
                    tags: '["leadership", "crise", "résilience", "transformation"]',
                    difficulty: 'Hard',
                    readTime: 25,
                    views: 456,
                    programId: program2.id,
                    publishedAt: new Date()
                },
                {
                    title: 'IELTS Success: From 5.5 to 8.5 in 3 Months',
                    subtitle: 'Témoignage d\'une transformation IELTS spectaculaire',
                    content: 'Méthodologie step-by-step pour passer de score moyen à excellence IELTS.',
                    summary: 'Transformation IELTS spectaculaire',
                    industry: 'Education',
                    company: 'CBTC Student',
                    tags: '["ielts", "success", "transformation", "excellence"]',
                    difficulty: 'Easy',
                    readTime: 12,
                    views: 789,
                    programId: program3.id,
                    publishedAt: new Date()
                }
            ]
        });
        console.log('   ✅ 3 études de cas inspirantes créées\n');
        // ========================================
        // PHASE 8: INSCRIPTIONS ET PROGRESSION
        // ========================================
        console.log('📝 Phase 8: Création des inscriptions et progression...');
        // Inscription de Kofi au programme Starter
        const enrollment1 = await prisma.enrollment.create({
            data: {
                userId: kofi.id,
                programId: program1.id,
                enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
                progress: 75.5,
                paymentStatus: 'paid',
                paymentAmount: 299.00,
                paymentDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
            }
        });
        // Progression des leçons pour Kofi
        const lessons = await prisma.lesson.findMany({
            where: { programId: program1.id },
            orderBy: { order: 'asc' }
        });
        await prisma.lessonProgress.createMany({
            data: [
                {
                    userId: kofi.id,
                    lessonId: lessons[0].id,
                    isCompleted: true,
                    completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
                    timeSpent: 2700, // 45 minutes
                    progress: 100,
                    notes: 'Excellente introduction ! Très inspirant.',
                    rating: 5
                },
                {
                    userId: kofi.id,
                    lessonId: lessons[1].id,
                    isCompleted: true,
                    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                    timeSpent: 3600, // 60 minutes
                    progress: 100,
                    notes: 'Vision claire et actionnable.',
                    rating: 5
                },
                {
                    userId: kofi.id,
                    lessonId: lessons[2].id,
                    isCompleted: false,
                    timeSpent: 2250, // 37.5 minutes (50% de 75 minutes)
                    progress: 50,
                    notes: 'En cours... très dense mais passionnant !'
                }
            ]
        });
        console.log('   ✅ Inscriptions et progression créées\n');
        // ========================================
        // PHASE 9: RÉSULTATS IELTS
        // ========================================
        console.log('🎯 Phase 9: Création des résultats IELTS...');
        await prisma.iELTSTestResult.createMany({
            data: [
                {
                    userId: kofi.id,
                    testType: 'diagnostic',
                    listeningScore: 6.5,
                    readingScore: 6.0,
                    writingScore: 5.5,
                    speakingScore: 6.0,
                    overallScore: 6.0,
                    targetScore: 8.5,
                    testDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                    completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                    timeSpentMinutes: 180,
                    feedback: 'Bon potentiel ! Focus sur l\'écriture et la lecture pour atteindre l\'excellence.',
                    strengths: '["listening", "speaking fluency"]',
                    weaknesses: '["writing coherence", "reading speed"]',
                    recommendations: '["practice writing daily", "speed reading exercises", "vocabulary expansion"]',
                    isCompleted: true,
                    attemptNumber: 1
                },
                {
                    userId: kofi.id,
                    testType: 'practice',
                    listeningScore: 7.5,
                    readingScore: 7.0,
                    writingScore: 6.5,
                    speakingScore: 7.0,
                    overallScore: 7.0,
                    targetScore: 8.5,
                    testDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    timeSpentMinutes: 165,
                    feedback: 'Excellent progrès ! Vous êtes sur la voie de l\'excellence IELTS.',
                    strengths: '["listening improvement", "speaking confidence", "reading comprehension"]',
                    weaknesses: '["writing task 2 structure"]',
                    recommendations: '["master writing templates", "advanced vocabulary integration"]',
                    isCompleted: true,
                }
            ]
        });
        console.log('   ✅ Résultats IELTS créés\n');
        // ========================================
        // RÉCAPITULATIF FINAL
        // ========================================
        console.log('🎊 ============================================');
        console.log('   ÉCOSYSTÈME CBTC CRÉÉ AVEC EXCELLENCE !');
        console.log('🎊 ============================================');
        console.log(`👥 4 Utilisateurs d'élite (Abel + 3 experts)`);
        console.log(`📂 4 Catégories d'excellence`);
        console.log(`🎓 4 Programmes révolutionnaires`);
        console.log(`📚 8 Leçons transformatrices`);
        console.log(`💼 3 Études de cas inspirantes`);
        console.log(`📝 1 Inscription active avec progression`);
        console.log(`🎯 2 Résultats IELTS (progression 6.0 → 7.0)`);
        console.log(`🔗 Relations et données cohérentes`);
        console.log('\n🌟 Votre vision Abel devient réalité technique !');
        console.log('🚀 Prêt pour transformer l\'entrepreneuriat africain !');
        console.log('============================================\n');
    }
    catch (error) {
        console.error('❌ Erreur durant l\'ensemencement CBTC:', error);
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
    console.log('📊 Base de données déconnectée proprement.');
});
//# sourceMappingURL=seed.js.map