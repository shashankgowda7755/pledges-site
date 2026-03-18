import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import prisma from '@/lib/prisma';

export default async function QuizPage() {
  const quizzes = await prisma.quiz.findMany({
    where: { isActive: true },
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 mb-4">Test Your Knowledge.<br/>Earn Your Certificate.</h1>
          <p className="text-xl text-gray-600 lg:w-2/3">Complete a quiz. Download your certificate instantly.</p>
        </div>
        
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          <span className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer">All</span>
          <span className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Environment</span>
          <span className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Health</span>
          <span className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 cursor-pointer transition-colors">Lifestyle</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-teal-100 transition-all">
              <div className="h-48 overflow-hidden relative bg-gray-100">
                {q.bgImageUrl && <img src={q.bgImageUrl} alt={q.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wide">
                  {q.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold font-montserrat text-gray-900 mb-2">{q.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px]">❓</span> {q._count.questions} Questions</span>
                  <span>•</span>
                  <span>{q._count.attempts} attempts</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <Link href={`/quiz/${q.slug}`} className="text-teal-600 font-semibold inline-flex items-center group-hover:text-teal-700 w-full justify-between">
                    Take Quiz <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
