import { useState } from 'react';
import { Plus, Trash2, Tag, X, ChevronRight, User as UserIcon, Briefcase, GraduationCap, Wrench } from 'lucide-react';
import { saveCandidateProfile } from '@/lib/storage';
import { EXPERIENCE_LEVELS, WORK_MODALITIES, CONTRACT_TYPES } from '@/types';
import type { Experience, Page } from '@/types';

interface OnboardingPageProps {
  userId: string;
  userName: string;
  onComplete: () => void;
  onNavigate: (page: Page) => void;
}

const STEP_LABELS = ['Dados Pessoais', 'Matchmaking', 'Escolaridade', 'Habilidades'];
const STEP_ICONS = [UserIcon, Briefcase, GraduationCap, Wrench];

const EDUCATION_OPTIONS = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação / MBA',
  'Mestrado',
  'Doutorado',
];

const SKILL_SUGGESTIONS = [
  'Pacote Office', 'Atendimento ao cliente', 'Trabalho em equipe', 'Comunicação',
  'Excel avançado', 'Liderança', 'Inglês básico', 'CNH B', 'NR-10',
  'Gestão de estoque', 'Negociação', 'Proatividade',
];

function newExperience(): Experience {
  return { id: `exp_${Date.now()}`, company: '', role: '', period: '' };
}

function selectField(
  label: string,
  value: string,
  onChange: (v: string) => void,
  options: string[],
  accent: 'sky' | 'amber' = 'sky'
) {
  const ring = accent === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-sky-500';
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 ${ring} focus:border-transparent transition`}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function OnboardingPage({ userId, userName, onComplete, onNavigate }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([newExperience()]);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [experienceLevel, setExperienceLevel] = useState('');
  const [workModality, setWorkModality] = useState('');
  const [contractType, setContractType] = useState('');

  const addExperience = () => setExperiences((prev) => [...prev, newExperience()]);
  const removeExperience = (id: string) =>
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  const updateExperience = (id: string, field: keyof Omit<Experience, 'id'>, value: string) =>
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setSkillInput('');
  };
  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    const err = await saveCandidateProfile(userId, {
      full_name: userName,
      phone: phone.trim(),
      education_level: education,
      experience_level: experienceLevel,
      work_modality: workModality,
      contract_type: contractType,
      summary: summary.trim(),
      skills,
    });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    onComplete();
  };

  const canAdvance = () => {
    if (step === 0) return phone.trim().length > 0;
    if (step === 1) return experienceLevel && workModality && contractType;
    if (step === 2) return education.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {userName.split(' ')[0]}! Vamos montar seu perfil
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Preencha as informações abaixo para se candidatar às vagas.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    i === step ? 'bg-sky-600 text-white' : i < step ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </div>
                {i < STEP_LABELS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Dados Pessoais</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Telefone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(81) 99999-0000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resumo Profissional
                  <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Descreva brevemente sua experiência, objetivos e diferenciais..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Experiências Profissionais
                  <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                </label>
                <div className="space-y-3">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Experiência {idx + 1}
                        </span>
                        {experiences.length > 1 && (
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Empresa"
                          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        />
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Cargo"
                          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                          placeholder="Período (ex: Jan/2022 – Atual)"
                          className="sm:col-span-2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-700 transition-colors mt-3"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar experiência
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Preferências Profissionais</h2>
              <p className="text-sm text-slate-500 mb-5">
                Estas informações ajudam a encontrar vagas ideais para você.
              </p>
              {selectField('Nível de Experiência *', experienceLevel, setExperienceLevel, EXPERIENCE_LEVELS)}
              {selectField('Modalidade de Trabalho *', workModality, setWorkModality, WORK_MODALITIES)}
              {selectField('Tipo de Contrato Desejado *', contractType, setContractType, CONTRACT_TYPES)}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-5">Escolaridade</h2>
              <div className="grid grid-cols-1 gap-3">
                {EDUCATION_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                      education === opt ? 'border-sky-500 bg-sky-50 text-sky-800' : 'border-slate-200 hover:border-sky-300 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${education === opt ? 'border-sky-600 bg-sky-600' : 'border-slate-300'}`} />
                    <input type="radio" className="sr-only" name="education" value={opt} checked={education === opt} onChange={() => setEducation(opt)} />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">Habilidades</h2>
              <p className="text-sm text-slate-500 mb-5">
                Digite uma habilidade e pressione Enter, ou clique nas sugestões abaixo.
              </p>
              <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                {skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1.5 bg-sky-100 text-sky-800 text-sm font-medium px-3 py-1.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-sky-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Digite uma habilidade e pressione Enter"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition mb-5"
              />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sugestões</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 font-medium px-3 py-1.5 rounded-full transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mt-5">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step === 0 ? (
              <button onClick={() => onNavigate('dashboard')} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Pular por agora
              </button>
            ) : (
              <button onClick={() => setStep((s) => s - 1)} className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
                ← Voltar
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Salvando...' : 'Salvar e ver vagas'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
