import { NextResponse } from 'next/server';
import { findCourseByIdOrSlug } from '@/lib/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = findCourseByIdOrSlug(params.id);
    
    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
      message: 'Cours récupéré avec succès'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération du cours' },
      { status: 500 }
    );
  }
}
