import { CheckCircle2, X } from 'lucide-react';

interface ApplyModalProps {
  jobTitle: string;
  company: string;
  onClose: () => void;
}

export default function ApplyModal({ jobTitle, company, onClose }: ApplyModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Inscrição realizada com sucesso!
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Seu currículo foi enviado para a empresa{' '}
              <span className="font-semibold text-slate-700">{company}</span> referente à vaga de{' '}
              <span className="font-semibold text-slate-700">{jobTitle}</span>.
            </p>
          </div>

          <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-4 py-3 leading-relaxed">
            Aguarde o contato da empresa. Fique de olho no seu e-mail e telefone!
          </p>

          <button
            onClick={onClose}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Ótimo, obrigado!
          </button>
        </div>
      </div>
    </div>
  );
}
