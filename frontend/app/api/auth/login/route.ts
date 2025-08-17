import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
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
      message: '🚀 Connexion CBTC réussie ! Redirection...',
      user: { email, role, name: email.split('@')[0] },
      token: 'cbtc-demo-' + Date.now()
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion' }, 
      { status: 500 }
    );
  }
}
