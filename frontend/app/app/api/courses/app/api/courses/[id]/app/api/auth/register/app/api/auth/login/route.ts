import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis pour accéder à votre espace CBTC' }, 
        { status: 400 }
      );
    }
    
    // Simulation d'authentification
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Démo : accepter tout email/mot de passe valide
    return NextResponse.json({ 
      success: true, 
      message: '🚀 Reconnexion réussie ! Bienvenue dans votre espace d\'excellence.',
      token: 'demo-jwt-token-' + Date.now(),
      user: { email, role: email.includes('admin') ? 'admin' : 'student' }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion. Vérifiez vos identifiants.' }, 
      { status: 500 }
    );
  }
}
