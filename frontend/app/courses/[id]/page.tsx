import { findCourseByIdOrSlug } from '@/lib/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CourseDetailProps {
  params: { id: string };
}

export default function CourseDetailPage({ params }: CourseDetailProps) {
  const course = findCourseByIdOrSlug(params.id);
  if (!course) { notFound(); }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
          ← Retour aux formations
        </Link>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{course.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
