import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Banknote,
  Briefcase,
  Clock,
  CheckCircle2,
  Building2,
  Send,
} from 'lucide-react';
import ApplyModal from '@/components/ApplyModal';
import type { Job, Page } from '@/types';

interface JobDetailPageProps {
  job: Job;
  isLoggedIn: boolean;
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

const AREA_COLORS: Record<string, string> = {
  Comércio: 'bg-orange-100 text-orange-700',
  Administração: 'bg-blue-100 text-blue-700',
  Construção: 'bg-yellow-100 text-yellow-700',
  TI: 'bg-violet-100 text-violet-700',
  Saúde: 'bg-green-100 text-green-700',
  Alimentação: 'bg-red-100 text-red-700',
  Transporte: 'bg-cyan-100 text-cyan-700',
  Educação: 'bg-indigo-100 text-indigo-700',
  'Serviços Gerais': 'bg-slate-100 text-slate-700',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function JobDetailPage({ job, isLoggedIn, onNavigate, onBack }: JobDetailPageProps) {
  const [showModal, setShowModal] = useState(false);
  const areaColor = AREA_COLORS[job.area] ?? 'bg-slate-100 text-slate-700';

  const handleApply = () => {
    if (!isLoggedIn) {
      onNavigate('login');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às vagas
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-br from-sky-800 to-sky-700 p-7 text-white">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-1">{job.title}</h1>
                <p className="text-sky-200 font-medium">{job.company}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${areaColor}`}>
                {job.area}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-sky-300 text-xs mb-1">
                  <Banknote className="w-3.5 h-3.5" />
                  Salário
                </div>
                <p className="text-sm font-semibold text-white">{job.salary}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-sky-300 text-xs mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Contrato
                </div>
                <p className="text-sm font-semibold text-white">{job.type}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 col-span-2">
                <div className="flex items-center gap-1.5 text-sky-300 text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Local
                </div>
                <p className="text-sm font-semibold text-white truncate">{job.location}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-7 space-y-7">
            {/* Description */}
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-3">Descrição da vaga</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-3">Requisitos</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-3">Benefícios</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Posted date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-100">
              <Clock className="w-3.5 h-3.5" />
              Publicada em {formatDate(job.postedAt)}
            </div>
          </div>

          {/* CTA */}
          <div className="px-7 pb-7">
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-base transition-all duration-150 shadow-md shadow-sky-200"
            >
              <Send className="w-5 h-5" />
              Candidatar-se a esta vaga
            </button>
            {!isLoggedIn && (
              <p className="text-center text-xs text-slate-400 mt-2">
                Você precisa estar logado para se candidatar.
              </p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ApplyModal
          jobTitle={job.title}
          company={job.company}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
