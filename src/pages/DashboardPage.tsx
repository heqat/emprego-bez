import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { MOCK_JOBS, AREAS } from '@/data/mockJobs';
import { getPublishedJobs } from '@/lib/storage';
import JobCard from '@/components/JobCard';
import type { Job, Page } from '@/types';

interface DashboardPageProps {
  isLoggedIn: boolean;
  onJobClick: (job: Job) => void;
  onNavigate: (page: Page) => void;
  refreshKey: number;
}

export default function DashboardPage({ isLoggedIn, onJobClick, onNavigate, refreshKey }: DashboardPageProps) {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas as áreas');
  const [showFilters, setShowFilters] = useState(false);

  const allJobs = useMemo(() => {
    const published = getPublishedJobs();
    return [...published, ...MOCK_JOBS];
  }, [refreshKey]);

  const filtered = useMemo(() => {
    return allJobs.filter((job) => {
      const matchArea =
        selectedArea === 'Todas as áreas' || job.area === selectedArea;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.area.toLowerCase().includes(q);
      return matchArea && matchSearch;
    });
  }, [search, selectedArea, allJobs]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-sky-800 to-sky-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Vagas disponíveis</h1>
          <p className="text-sky-200 text-sm">
            {allJobs.length} oportunidades em Bezerros e região
          </p>

          {/* Search bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por cargo, empresa ou área..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                showFilters
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Área de atuação
              </p>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      selectedArea === area
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active filter chip */}
        {selectedArea !== 'Todas as áreas' && (
          <div className="flex items-center gap-2 mb-5">
            <span className="text-sm text-slate-500">Filtrando por:</span>
            <span className="flex items-center gap-1.5 bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-full">
              {selectedArea}
              <button onClick={() => setSelectedArea('Todas as áreas')}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-600 mb-1">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-slate-400 text-sm">
              Tente outros termos ou remova os filtros aplicados.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedArea('Todas as áreas'); }}
              className="mt-4 text-sm text-sky-600 font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} onClick={onJobClick} />
            ))}
          </div>
        )}

        {/* CTA for guests */}
        {!isLoggedIn && (
          <div className="mt-10 bg-gradient-to-r from-sky-700 to-sky-800 rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              Candidate-se com um clique!
            </h3>
            <p className="text-sky-200 text-sm mb-5">
              Crie sua conta grátis e envie seu currículo para as empresas.
            </p>
            <button
              onClick={() => onNavigate('register')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-7 py-3 rounded-xl text-sm transition-colors"
            >
              Criar conta grátis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
