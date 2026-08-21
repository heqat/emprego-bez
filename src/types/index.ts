export type UserRole = 'cidadao' | 'empresa';

export type ExperienceLevel = 'Primeiro Emprego' | 'Estágio' | 'Júnior' | 'Pleno' | 'Sênior';
export type WorkModality = 'Presencial' | 'Híbrido' | 'Remoto';
export type ContractType = 'CLT' | 'PJ' | 'Temporário' | 'Autônomo';

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Primeiro Emprego',
  'Estágio',
  'Júnior',
  'Pleno',
  'Sênior',
];

export const WORK_MODALITIES: WorkModality[] = ['Presencial', 'Híbrido', 'Remoto'];

export const CONTRACT_TYPES: ContractType[] = ['CLT', 'PJ', 'Temporário', 'Autônomo'];

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  companyName?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
}

export interface Profile {
  phone: string;
  address: string;
  summary: string;
  experiences: Experience[];
  education: string;
  skills: string[];
}

export interface CompanyProfile {
  document: string;
  address: string;
  branch: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  area: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  ownerId?: string;
  experienceLevel?: string;
  workModality?: string;
  contractType?: string;
}

export type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'company-onboarding'
  | 'dashboard'
  | 'job-detail'
  | 'company-dashboard'
  | 'publish-job';
