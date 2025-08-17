import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, firstName, lastName } = body || {};
    
    // Validation entrepreneuriale
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis pour rejoindre l\'excellence CBTC' }, 
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mot de passe trop court - l\'excellence requiert au moins 6 caractères' }, 
        { status: 400 }
      );
    }
    
    // Simulation authentique d'un traitement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ 
      success: true, 
      message: `🎉 Bienvenue ${firstName || 'futur entrepreneur'} ! Votre compte CBTC est créé avec succès.`,
      user: { email, role: 'student', name: firstName || email.split('@')[0] }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création - l\'excellence mérite une seconde chance' }, 
      { status: 500 }
    );
  }
}
