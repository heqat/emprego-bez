/*
# Add auth.uid() defaults to owner columns

## Overview
The jobs.company_id and candidate_profiles.user_id columns had no database
default. With RLS policies requiring auth.uid() = company_id / user_id, inserts
that omit these columns would fail. This migration sets the defaults so the
frontend can insert without threading the owner ID through every call.

## Changes
1. jobs.company_id: set DEFAULT auth.uid()
2. candidate_profiles.user_id: set DEFAULT auth.uid()

## Security Notes
- These defaults are safe: auth.uid() returns the authenticated user's UUID,
  so a user cannot impersonate another by omitting the column.
- The columns remain nullable (existing schema) but the DEFAULT fills them
  automatically on insert.
*/

ALTER TABLE jobs ALTER COLUMN company_id SET DEFAULT auth.uid();
ALTER TABLE candidate_profiles ALTER COLUMN user_id SET DEFAULT auth.uid();
