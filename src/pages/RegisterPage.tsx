import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Briefcase, CheckCircle2, User as UserIcon, Building2 } from 'lucide-react';
import { signUp } from '@/lib/storage';
import type { AppUser, UserRole, Page } from '@/types';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
  onRegisterSuccess: (user: AppUser) => void;
}

export default function RegisterPage({ onNavigate, onRegisterSuccess }: RegisterPageProps) {
  const [role, setRole] = useState<UserRole | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const isCompany = role === 'empresa';
    const { user, error: signUpError } = await signUp(
      email.toLowerCase().trim(),
      password,
      role ?? 'cidadao',
      isCompany ? companyName.trim() : undefined
    );

    if (signUpError || !user) {
      setError(signUpError || 'Não foi possível criar a conta.');
      setLoading(false);
      return;
    }

    onRegisterSuccess(user);
    setLoading(false);
  };

  const citizenBenefits = [
    'Candidate-se a vagas com um clique',
    'Currículo enviado automaticamente',
    'Acompanhe suas candidaturas',
  ];
  const companyBenefits = [
    'Publique vagas para toda a cidade',
    'Receba currículos de candidatos locais',
    'Gerencie suas vagas em um painel',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Criar conta</h1>
              <p className="text-xs text-slate-500">É grátis e leva menos de 1 minuto</p>
            </div>
          </div>

          {!role && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Escolha seu perfil:</p>
              <button
                onClick={() => setRole('cidadao')}
                className="w-full flex items-center gap-4 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 rounded-xl p-4 transition-all text-left group"
              >
                <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
                  <UserIcon className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Quero me Candidatar</p>
                  <p className="text-xs text-slate-500">Cidadão em busca de emprego</p>
                </div>
              </button>

              <button
                onClick={() => setRole('empresa')}
                className="w-full flex items-center gap-4 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl p-4 transition-all text-left group"
              >
                <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Quero Contratar</p>
                  <p className="text-xs text-slate-500">Empresa ou Empreendedor</p>
                </div>
              </button>
            </div>
          )}

          {role && (
            <>
              <button
                onClick={() => { setRole(null); setError(''); }}
                className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Trocar perfil
              </button>

              <ul className="space-y-1.5 my-5">
                {(role === 'cidadao' ? citizenBenefits : companyBenefits).map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-100 mb-6" />

              <form onSubmit={handleSubmit} className="space-y-4">
                {role === 'cidadao' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="João da Silva"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nome do Responsável
                      </label>
                      <input
                        type="text"
                        required
                        value={responsibleName}
                        onChange={(e) => setResponsibleName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nome da Empresa (ou Negócio)
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: Padaria São João"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-1 disabled:opacity-60 ${
                    role === 'empresa'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  {loading ? 'Criando conta...' : 'Criar conta e continuar'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-slate-500 mt-5">
            Já tem conta?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-sky-600 font-semibold hover:underline"
            >
              Faça login
            </button>
          </p>
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
