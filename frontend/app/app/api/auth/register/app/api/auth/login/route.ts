import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Identifiants requis pour accéder à votre espace d\'excellence' }, 
        { status: 400 }
      );
    }
    
    // Simulation d'authentification - accepte tout pour la démo
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Logique de rôles intelligente
    const role = email.includes('admin') ? 'admin' : 
                 email.includes('prof') || email.includes('instructor') ? 'instructor' : 'student';
    
    return NextResponse.json({ 
      success: true, 
      message: '🚀 Reconnexion réussie ! Bienvenue dans votre espace d\'excellence.',
      token: 'cbtc-demo-jwt-' + Date.now(),
      user: { 
        email, 
        role,
        name: email.split('@')[0],
        lastLogin: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion - vérifiez vos identifiants d\'excellence' }, 
      { status: 500 }
    );
  }
}
