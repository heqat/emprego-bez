import { useState, useEffect } from 'react';
import { Plus, Building2, Briefcase, MapPin, Banknote, Clock, Eye } from 'lucide-react';
import { fetchCompanyJobs, getCompanyProfile } from '@/lib/storage';
import type { Job, CompanyProfile, Page } from '@/types';

interface CompanyDashboardPageProps {
  ownerId: string;
  companyName: string;
  onNavigate: (page: Page) => void;
  onJobClick: (job: Job) => void;
  refreshKey: number;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function CompanyDashboardPage({
  ownerId,
  companyName,
  onNavigate,
  onJobClick,
  refreshKey,
}: CompanyDashboardPageProps) {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCompanyJobs(ownerId), getCompanyProfile(ownerId)]).then(
      ([jobs, prof]) => {
        setMyJobs(jobs);
        setProfile(prof);
        setLoading(false);
      }
    );
  }, [ownerId, refreshKey]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-amber-100 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            PAINEL DA EMPRESA
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{companyName}</h1>
          <p className="text-amber-100 text-sm">
            Gerencie suas vagas e encontre candidatos em Bezerros.
          </p>

          <button
            onClick={() => onNavigate('publish-job')}
            className="mt-6 flex items-center gap-2 bg-white text-amber-700 font-bold px-5 py-3 rounded-xl text-sm hover:bg-amber-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Publicar Nova Vaga
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{myJobs.length}</p>
                <p className="text-xs text-slate-500">Vagas publicadas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">0</p>
                <p className="text-xs text-slate-500">Candidaturas</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {profile?.branch ?? 'Não definido'}
                </p>
                <p className="text-xs text-slate-500">Ramo de atuação</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Minhas vagas</h2>
          {myJobs.length > 0 && (
            <button
              onClick={() => onNavigate('publish-job')}
              className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova vaga
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Carregando suas vagas...</p>
          </div>
        ) : myJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Você ainda não publicou vagas
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Publique sua primeira vaga e comece a receber candidaturas.
            </p>
            <button
              onClick={() => onNavigate('publish-job')}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Publicar primeira vaga
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onJobClick(job)}
                className="w-full text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Banknote className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                      {job.contractType || job.type}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                      {job.area}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
