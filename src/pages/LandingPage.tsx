import { useState, useEffect } from 'react';
import { Search, ArrowRight, MapPin, Users, TrendingUp, Star, AlertCircle } from 'lucide-react';
import { fetchJobs } from '@/lib/storage';
import JobCard from '@/components/JobCard';
import type { Job, Page } from '@/types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onJobClick: (job: Job) => void;
}

const STATS = [
  { label: 'Vagas ativas', value: '120+', icon: TrendingUp },
  { label: 'Empresas parceiras', value: '45+', icon: Users },
  { label: 'Candidatos inscritos', value: '800+', icon: Star },
];

export default function LandingPage({ onNavigate, onJobClick }: LandingPageProps) {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs().then(({ jobs, error: err }) => {
      if (err) {
        setError(err);
        setRecentJobs([]);
      } else {
        setRecentJobs(jobs.slice(0, 6));
        setError(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-700/60 border border-sky-500/40 rounded-full px-4 py-1.5 text-sm mb-6">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-sky-200">Bezerros, Pernambuco</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Encontre seu{' '}
              <span className="text-amber-400">próximo emprego</span>{' '}
              aqui em Bezerros
            </h1>

            <p className="text-sky-200 text-lg leading-relaxed mb-10 max-w-xl">
              A plataforma oficial de empregos do município. Conectamos talentos locais com as
              melhores oportunidades da nossa cidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/30 text-base"
              >
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base backdrop-blur-sm"
              >
                Já tenho conta
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-12 fill-slate-50">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      <section className="bg-slate-50 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Vagas Recentes</h2>
              <p className="text-slate-500 mt-1">Oportunidades publicadas nos últimos dias</p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hidden sm:flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold text-sm transition-colors"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Carregando vagas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
              <p className="text-red-500 text-sm font-medium mb-1">
                Não foi possível carregar as vagas.
              </p>
              <p className="text-slate-400 text-xs">Tente novamente em alguns instantes.</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                Ainda não há vagas publicadas. Volte em breve!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={onJobClick} />
              ))}
            </div>
          )}

          {!loading && recentJobs.length > 0 && (
            <div className="mt-8 text-center sm:hidden">
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 text-sky-600 font-semibold"
              >
                Ver todas as vagas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sky-700 to-sky-900 rounded-3xl p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Pronto para dar o próximo passo?
              </h2>
              <p className="text-sky-200 text-base leading-relaxed">
                Cadastre-se gratuitamente, monte seu currículo e candidate-se às vagas com um
                clique.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Criar conta grátis
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Ver vagas
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-slate-300 mb-1">Bezerros Conecta Empregos</p>
          <p className="text-sm">Prefeitura Municipal de Bezerros — Pernambuco</p>
          <p className="text-xs mt-4">© 2026 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
