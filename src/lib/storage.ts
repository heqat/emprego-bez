import { supabase } from '@/lib/supabase';
import type { AppUser, UserRole, CompanyProfile, Job } from '@/types';

// ============ Auth ============

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  companyName?: string
): Promise<{ user: AppUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, company_name: companyName } },
  });

  if (error) return { user: null, error: error.message };

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email: email.toLowerCase(),
      role,
    });

    if (profileError) {
      return { user: null, error: 'Falha ao criar perfil: ' + profileError.message };
    }

    const appUser: AppUser = {
      id: data.user.id,
      email: email.toLowerCase(),
      role,
      companyName,
    };
    return { user: appUser, error: null };
  }

  return { user: null, error: 'Não foi possível criar a conta.' };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: AppUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const role: UserRole = (profile?.role as UserRole) || 'cidadao';
    const companyName = data.user.user_metadata?.company_name as string | undefined;

    return {
      user: { id: data.user.id, email: data.user.email!, role, companyName },
      error: null,
    };
  }

  return { user: null, error: 'Credenciais inválidas.' };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role: UserRole = (profile?.role as UserRole) || 'cidadao';
  const companyName = user.user_metadata?.company_name as string | undefined;

  return { id: user.id, email: user.email!, role, companyName };
}

// ============ Company Profile ============

export async function getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
  // The profiles table stores role + email; company details (document, address, branch, description)
  // are stored in user_metadata since there's no dedicated company_profiles table.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata || {};
  if (!meta.company_document && !meta.company_address) return null;

  return {
    document: meta.company_document || '',
    address: meta.company_address || '',
    branch: meta.company_branch || '',
    description: meta.company_description || '',
  };
}

export async function saveCompanyProfile(
  userId: string,
  profile: CompanyProfile
): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({
    data: {
      company_document: profile.document,
      company_address: profile.address,
      company_branch: profile.branch,
      company_description: profile.description,
    },
  });
  return error ? error.message : null;
}

// ============ Candidate Profile ============

export async function saveCandidateProfile(
  userId: string,
  data: {
    full_name: string;
    phone: string;
    education_level: string;
    experience_level: string;
    work_modality: string;
    contract_type: string;
    summary: string;
    skills: string[];
  }
): Promise<string | null> {
  const { error } = await supabase.from('candidate_profiles').upsert({
    user_id: userId,
    full_name: data.full_name,
    phone: data.phone,
    education_level: data.education_level,
    experience_level: data.experience_level,
    work_modality: data.work_modality,
    contract_type: data.contract_type,
    summary: data.summary,
    skills: data.skills,
  });
  return error ? error.message : null;
}

// ============ Jobs ============

export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'aberta')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    title: String(row.title ?? ''),
    company: String(row.company_name ?? ''),
    area: String(row.area ?? ''),
    location: String(row.company_name ? 'Bezerros - PE' : ''),
    salary: String(row.salary ?? 'A combinar'),
    type: String(row.contract_type ?? 'CLT'),
    description: String(row.description ?? ''),
    requirements: row.requirements
      ? String(row.requirements).split('\n').filter(Boolean)
      : [],
    benefits: [],
    postedAt: String(row.created_at ?? '').slice(0, 10),
    ownerId: String(row.company_id ?? ''),
    experienceLevel: String(row.experience_level ?? ''),
    workModality: String(row.work_modality ?? ''),
    contractType: String(row.contract_type ?? ''),
  }));
}

export async function fetchCompanyJobs(companyId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    title: String(row.title ?? ''),
    company: String(row.company_name ?? ''),
    area: String(row.area ?? ''),
    location: String(row.company_name ? 'Bezerros - PE' : ''),
    salary: String(row.salary ?? 'A combinar'),
    type: String(row.contract_type ?? 'CLT'),
    description: String(row.description ?? ''),
    requirements: row.requirements
      ? String(row.requirements).split('\n').filter(Boolean)
      : [],
    benefits: [],
    postedAt: String(row.created_at ?? '').slice(0, 10),
    ownerId: String(row.company_id ?? ''),
    experienceLevel: String(row.experience_level ?? ''),
    workModality: String(row.work_modality ?? ''),
    contractType: String(row.contract_type ?? ''),
  }));
}

export async function publishJob(
  companyId: string,
  companyName: string,
  job: {
    title: string;
    description: string;
    requirements: string;
    education_required: string;
    area: string;
    salary: string;
    experience_level: string;
    work_modality: string;
    contract_type: string;
  }
): Promise<string | null> {
  const { error } = await supabase.from('jobs').insert({
    company_id: companyId,
    company_name: companyName,
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    education_required: job.education_required,
    area: job.area,
    salary: job.salary,
    experience_level: job.experience_level,
    work_modality: job.work_modality,
    contract_type: job.contract_type,
    status: 'aberta',
  });
  return error ? error.message : null;
}

// ============ Applications ============

export async function applyToJob(
  candidateId: string,
  jobId: string
): Promise<string | null> {
  const { error } = await supabase.from('applications').insert({
    candidate_id: candidateId,
    job_id: jobId,
  });
  return error ? error.message : null;
}
