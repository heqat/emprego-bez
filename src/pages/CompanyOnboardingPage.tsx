import { useState } from 'react';
import { ArrowLeft, Building2, ChevronRight, MapPin, FileText } from 'lucide-react';
import { saveCompanyProfile } from '@/lib/storage';
import type { CompanyProfile, Page } from '@/types';

interface CompanyOnboardingPageProps {
  userId: string;
  companyName: string;
  onComplete: () => void;
  onNavigate: (page: Page) => void;
}

const BRANCH_OPTIONS = [
  'Comércio', 'Administração', 'Construção', 'TI', 'Saúde',
  'Alimentação', 'Transporte', 'Educação', 'Serviços Gerais',
  'Indústria', 'Agricultura', 'Outro',
];

export default function CompanyOnboardingPage({
  userId,
  companyName,
  onComplete,
  onNavigate,
}: CompanyOnboardingPageProps) {
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!document.trim() || !address.trim() || !branch) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    const profile: CompanyProfile = {
      document: document.trim(),
      address: address.trim(),
      branch,
      description: description.trim(),
    };
    const err = await saveCompanyProfile(userId, profile);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Bem-vindo, {companyName}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Complete o cadastro da sua empresa para começar a publicar vagas.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                CNPJ ou CPF <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="00.000.000/0000-00 ou 000.000.000-00"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Endereço em Bezerros <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro — Bezerros/PE"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ramo de Atuação <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRANCH_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBranch(opt)}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${
                      branch === opt
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-slate-200 text-slate-600 hover:border-amber-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Breve Descrição
                  <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                </span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte um pouco sobre a sua empresa ou negócio..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate('company-dashboard')}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Pular por agora
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Salvando...' : 'Salvar e continuar'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          className="mt-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
