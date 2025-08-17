import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Identifiants requis pour accéder à CBTC' }, 
        { status: 400 }
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const role = email.includes('admin') ? 'admin' : 
                 email.includes('prof') ? 'instructor' : 'student';
    
    return NextResponse.json({ 
      success: true, 
      message: '🚀 Connexion réussie ! Redirection en cours...',
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
      { error: 'Erreur de connexion' }, 
      { status: 500 }
    );
  }
}
