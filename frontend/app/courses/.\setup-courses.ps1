# ---- setup-courses.ps1 ----
param(
  [string]$FrontendDir = "frontend"
)

function Write-FileWithBackup {
  param([string]$Path, [string]$Content)
  $dir = Split-Path $Path -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  if (Test-Path $Path) {
    Copy-Item $Path "$Path.bak" -Force
  }
  $Content | Out-File -FilePath $Path -Encoding UTF8 -Force
  Write-Host "✅ Wrote $Path"
}

# 1) lib/config.ts
$cfgPath = Join-Path $FrontendDir "lib/config.ts"
$cfg = @"
export const API_URL = '';
"@
Write-FileWithBackup $cfgPath $cfg

# 2) app/courses/page.tsx
$coursesPagePath = Join-Path $FrontendDir "app/courses/page.tsx"
$coursesPage = @"
import Link from 'next/link';
import { API_URL } from '../../lib/config';

type Course = { id: string; title: string; description: string; price?: number; published?: boolean };

export const revalidate = 60;

async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(\`\${API_URL}/api/courses\`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Bad response');
    return await res.json();
  } catch {
    return [
      { id: 'demo-1', title: 'Entrepreneuriat 101', description: 'Bases pour démarrer', price: 0, published: true },
      { id: 'demo-2', title: 'Stratégie & Croissance', description: 'Vision, KPI, exécution', price: 99, published: true },
    ];
  }
}

export default async function CoursesPage() {
  const courses = await fetchCourses();
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Formations CBTC</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map(c => (
          <Link key={c.id} href={\`/courses/\${c.id}\`} className="border rounded p-4 hover:shadow">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{c.description}</p>
            {typeof c.price !== 'undefined' && (<p className="mt-2 text-blue-700">{c.price === 0 ? 'Gratuit' : \`\${c.price} €\`}</p>)}
          </Link>
        ))}
      </div>
    </main>
  );
}
"@
Write-FileWithBackup $coursesPagePath $coursesPage

# 3) app/courses/[id]/page.tsx
$courseDetailPath = Join-Path $FrontendDir "app/courses/[id]/page.tsx"
$courseDetail = @"
import { API_URL } from '../../../lib/config';

type Course = { id: string; title: string; description: string; price?: number; published?: boolean };

export default async function CourseDetail({ params }: { params: { id: string } }) {
  let course: Course | null = null;
  try {
    const res = await fetch(\`\${API_URL}/api/courses/\${params.id}\`, { cache: 'no-store' });
    if (res.ok) course = await res.json();
  } catch {}
  if (!course) {
    course = { id: params.id, title: 'Cours démo', description: 'Contenu à venir', price: 0, published: true };
  }
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-4 text-gray-700">{course.description}</p>
      <p className="mt-4 text-blue-700">{course.price ? \`\${course.price} €\` : 'Gratuit'}</p>
      <div className="mt-8 p-4 border rounded bg-gray-50">
        <p>Ressources du cours (à connecter à l’API prochainement)…</p>
      </div>
    </main>
  );
}
"@
Write-FileWithBackup $courseDetailPath $courseDetail

# 4) API: app/api/courses/route.ts
$coursesApiPath = Join-Path $FrontendDir "app/api/courses/route.ts"
$coursesApi = @"
import { NextResponse } from 'next/server';

const courses = [
  { id: 'demo-1', title: 'Entrepreneuriat 101', description: 'Les fondamentaux', price: 0, published: true },
  { id: 'demo-2', title: 'Stratégie & Croissance', description: 'Vision, KPI, exécution', price: 99, published: true },
  { id: 'demo-3', title: 'Leadership', description: 'Inspiration et impact', price: 149, published: true },
];

export async function GET() {
  await new Promise(r => setTimeout(r, 120));
  return NextResponse.json(courses.filter(c => c.published));
}
"@
Write-FileWithBackup $coursesApiPath $coursesApi

# 5) API: app/api/courses/[id]/route.ts
$coursesApiIdPath = Join-Path $FrontendDir "app/api/courses/[id]/route.ts"
$coursesApiId = @"
import { NextResponse } from 'next/server';

const detail = (id: string) => ({
  id,
  title: id === 'demo-2' ? 'Stratégie & Croissance' : id === 'demo-3' ? 'Leadership' : 'Entrepreneuriat 101',
  description: 'Détail du cours en préparation. Modules et ressources à venir.',
  price: id === 'demo-2' ? 99 : id === 'demo-3' ? 149 : 0,
  published: true,
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await new Promise(r => setTimeout(r, 100));
  return NextResponse.json(detail(params.id));
}
"@
Write-FileWithBackup $coursesApiIdPath $coursesApiId

# 6) Git commit
if (Test-Path ".git") {
  git add $FrontendDir/app/courses $FrontendDir/app/api/courses $cfgPath
  git commit -m "feat(courses): pages + APIs de démo opérationnelles" | Out-Null
  Write-Host "✅ Git commit prêt (pousse avec: git push)"
} else {
  Write-Host "ℹ️ Pas de repo Git détecté ici. Fichiers écrits localement."
}

Write-Host "🎉 Courses déployées côté frontend. Déploie Vercel puis teste /courses et /courses/demo-1"
# ---- fin ----
