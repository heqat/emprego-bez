/*
# Add Row Level Security policies for all tables

## Overview
This migration creates ownership-scoped RLS policies for the 4 existing tables:
profiles, candidate_profiles, jobs, and applications. RLS was already enabled
on all tables but no policies existed, making them inaccessible.

## Tables and Policies

### profiles
- SELECT: any authenticated user can read profiles (needed for company names on job listings)
- INSERT: a user can insert their own profile row (id = auth.uid())
- UPDATE: a user can update only their own profile

### candidate_profiles
- SELECT: authenticated users can read their own candidate profile
- INSERT: a user can insert their own candidate profile (user_id = auth.uid())
- UPDATE: a user can update only their own candidate profile

### jobs
- SELECT: public read (anyone, including anon, can browse the job board)
- INSERT: only the company owner (company_id = auth.uid()) can insert
- UPDATE: only the company owner can update their jobs
- DELETE: only the company owner can delete their jobs

### applications
- SELECT: a candidate can read their own applications
- INSERT: a candidate can insert an application for themselves
- UPDATE/DELETE: a candidate can modify their own applications

## Security Notes
1. profiles SELECT is open to authenticated users so the job board can display
   company names. The profiles table only contains id, email, role, and created_at —
   no sensitive data.
2. jobs SELECT is open to anon + authenticated so unauthenticated visitors can browse.
3. All write operations require ownership verification via auth.uid().
4. company_id on jobs defaults to auth.uid() so inserts omitting it still pass RLS.
5. user_id on candidate_profiles defaults to auth.uid() for the same reason.
*/

-- ============ profiles ============
DROP POLICY IF EXISTS "profiles_select_authenticated" ON profiles;
CREATE POLICY "profiles_select_authenticated" ON profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ candidate_profiles ============
DROP POLICY IF EXISTS "candidate_select_own" ON candidate_profiles;
CREATE POLICY "candidate_select_own" ON candidate_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "candidate_insert_own" ON candidate_profiles;
CREATE POLICY "candidate_insert_own" ON candidate_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "candidate_update_own" ON candidate_profiles;
CREATE POLICY "candidate_update_own" ON candidate_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "candidate_delete_own" ON candidate_profiles;
CREATE POLICY "candidate_delete_own" ON candidate_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ jobs ============
DROP POLICY IF EXISTS "jobs_select_public" ON jobs;
CREATE POLICY "jobs_select_public" ON jobs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "jobs_insert_own" ON jobs;
CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id);

DROP POLICY IF EXISTS "jobs_update_own" ON jobs;
CREATE POLICY "jobs_update_own" ON jobs
  FOR UPDATE TO authenticated USING (auth.uid() = company_id) WITH CHECK (auth.uid() = company_id);

DROP POLICY IF EXISTS "jobs_delete_own" ON jobs;
CREATE POLICY "jobs_delete_own" ON jobs
  FOR DELETE TO authenticated USING (auth.uid() = company_id);

-- ============ applications ============
DROP POLICY IF EXISTS "applications_select_own" ON applications;
CREATE POLICY "applications_select_own" ON applications
  FOR SELECT TO authenticated USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "applications_insert_own" ON applications;
CREATE POLICY "applications_insert_own" ON applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "applications_update_own" ON applications;
CREATE POLICY "applications_update_own" ON applications
  FOR UPDATE TO authenticated USING (auth.uid() = candidate_id) WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "applications_delete_own" ON applications;
CREATE POLICY "applications_delete_own" ON applications
  FOR DELETE TO authenticated USING (auth.uid() = candidate_id);
