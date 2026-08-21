import { MapPin, Building2, Banknote, Clock } from 'lucide-react';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  compact?: boolean;
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
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function JobCard({ job, onClick, compact }: JobCardProps) {
  const areaColor = AREA_COLORS[job.area] ?? 'bg-slate-100 text-slate-700';

  return (
    <button
      onClick={() => onClick(job)}
      className="w-full text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-sky-600" />
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${areaColor}`}
        >
          {job.area}
        </span>
      </div>

      <h3 className="font-semibold text-slate-800 group-hover:text-sky-700 transition-colors leading-snug mb-1">
        {job.title}
      </h3>
      <p className="text-sm text-slate-500 mb-3">{job.company}</p>

      {!compact && (
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Banknote className="w-3.5 h-3.5 flex-shrink-0" />
            {job.salary}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
          {job.contractType || job.type}
        </span>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(job.postedAt)}
        </div>
      </div>
    </button>
  );
}
