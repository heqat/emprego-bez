import { useState } from 'react';
import { ArrowLeft, Plus, X, ChevronRight, FileText } from 'lucide-react';
import { publishJob } from '@/lib/storage';
import { EXPERIENCE_LEVELS, WORK_MODALITIES, CONTRACT_TYPES } from '@/types';
import type { Page } from '@/types';

interface PublishJobPageProps {
  companyName: string;
  ownerId: string;
  onPublished: () => void;
  onNavigate: (page: Page) => void;
}

const AREAS = [
  'Comércio', 'Administração', 'Construção', 'TI', 'Saúde',
  'Alimentação', 'Transporte', 'Educação', 'Serviços Gerais',
];

const EDUCATION_OPTIONS = [
  'Não exigida',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação / MBA',
];

function selectField(
  label: string,
  value: string,
  onChange: (v: string) => void,
  options: readonly string[]
) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function PublishJobPage({
  companyName,
  ownerId,
  onPublished,
  onNavigate,
}: PublishJobPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [education, setEducation] = useState('');
  const [salary, setSalary] = useState('');
  const [area, setArea] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [workModality, setWorkModality] = useState('');
  const [contractType, setContractType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateRequirement = (idx: number, value: string) =>
    setRequirements((prev) => prev.map((r, i) => (i === idx ? value : r)));
  const addRequirement = () => setRequirements((prev) => [...prev, '']);
  const removeRequirement = (idx: number) =>
    setRequirements((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !description.trim() || !area || !education || !experienceLevel || !workModality || !contractType) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    const cleanReqs = requirements.map((r) => r.trim()).filter(Boolean).join('\n');
    const err = await publishJob(ownerId, companyName, {
      title: title.trim(),
      description: description.trim(),
      requirements: cleanReqs,
      education_required: education,
      area,
      salary: salary.trim() || 'A combinar',
      experience_level: experienceLevel,
      work_modality: workModality,
      contract_type: contractType,
    });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    onPublished();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('company-dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao painel
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Publicar Nova Vaga</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Preencha as informações da vaga que deseja oferecer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Título da vaga <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Vendedor(a), Auxiliar de Cozinha..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as atividades e responsabilidades da vaga..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Requisitos</label>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                    placeholder={`Requisito ${idx + 1}`}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold hover:text-amber-700 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar requisito
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectField('Escolaridade Exigida *', education, setEducation, EDUCATION_OPTIONS)}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Área de Atuação <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              >
                <option value="">Selecione...</option>
                {AREAS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {selectField('Nível de Experiência *', experienceLevel, setExperienceLevel, EXPERIENCE_LEVELS)}
            {selectField('Modalidade *', workModality, setWorkModality, WORK_MODALITIES)}
            {selectField('Tipo de Contrato *', contractType, setContractType, CONTRACT_TYPES)}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Salário</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Ex: R$ 1.800,00 ou A combinar"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('company-dashboard')}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Publicando...' : 'Publicar vaga'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
