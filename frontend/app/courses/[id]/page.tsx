export default function CourseDetail({ params }: { params: { id: string } }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Cours: {params.id}</h1>
      <p className="mt-4 text-gray-700">Détail à venir.</p>
    </main>
  );
}
