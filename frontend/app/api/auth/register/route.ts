import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, firstName } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis pour rejoindre CBTC' }, 
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'L\'excellence requiert un mot de passe d\'au moins 6 caractères' }, 
        { status: 400 }
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ 
      success: true, 
      message: `🎉 Bienvenue ${firstName || 'futur entrepreneur'} ! Compte CBTC créé avec succès.`,
      user: { email, role: 'student', name: firstName || email.split('@')[0] }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' }, 
      { status: 500 }
    );
  }
}
