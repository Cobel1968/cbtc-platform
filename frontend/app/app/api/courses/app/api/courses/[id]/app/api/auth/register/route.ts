import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, firstName, lastName, role } = body || {};
    
    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis pour rejoindre l\'excellence CBTC' }, 
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères pour sécuriser votre parcours' }, 
        { status: 400 }
      );
    }
    
    // Simulation d'un traitement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ 
      success: true, 
      message: `🎉 Bienvenue ${firstName || 'futur entrepreneur'} ! Votre compte ${role === 'instructor' ? 'professeur' : 'étudiant'} CBTC est créé avec succès.`,
      user: { email, role: role || 'student' }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte. Veuillez réessayer.' }, 
      { status: 500 }
    );
  }
}
