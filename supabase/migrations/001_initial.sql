-- ================================================================
-- Mercedes-Benz Links — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================
-- ── Extensions ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ── 1. User Roles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
   role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
   created_at TIMESTAMPTZ DEFAULT NOW(),
   UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- Users can see their own roles; admins can see all
CREATE POLICY "user_roles_select" ON public.user_roles FOR
SELECT USING (
      auth.uid() = user_id
      OR EXISTS (
         SELECT 1
         FROM public.user_roles ur
         WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin'
      )
   );
-- Only admins can assign roles
CREATE POLICY "user_roles_insert" ON public.user_roles FOR
INSERT WITH CHECK (
      EXISTS (
         SELECT 1
         FROM public.user_roles ur
         WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin'
      )
   );
CREATE POLICY "user_roles_delete" ON public.user_roles FOR DELETE USING (
   EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
         AND ur.role = 'admin'
   )
);
-- ── Helper: is the current session an admin? ────────────────────
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
SELECT EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
         AND role = 'admin'
   );
$$;
-- ── 2. Collaborators table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.collaborators (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   full_name TEXT NOT NULL,
   position TEXT NOT NULL,
   area TEXT NOT NULL,
   phone TEXT NOT NULL,
   email TEXT NOT NULL,
   slug TEXT NOT NULL UNIQUE,
   is_active BOOLEAN DEFAULT true NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
-- Public users can only read ACTIVE collaborators (no auth required)
-- Admins can read ALL collaborators (active and inactive)
CREATE POLICY "collaborators_select" ON public.collaborators FOR
SELECT USING (
      is_active = true
      OR public.is_admin()
   );
-- Only admins can insert
CREATE POLICY "collaborators_insert" ON public.collaborators FOR
INSERT WITH CHECK (public.is_admin());
-- Only admins can update
CREATE POLICY "collaborators_update" ON public.collaborators FOR
UPDATE USING (public.is_admin());
-- Only admins can delete
CREATE POLICY "collaborators_delete" ON public.collaborators FOR DELETE USING (public.is_admin());
-- ── Auto-update updated_at trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$;
CREATE TRIGGER set_collaborators_updated_at BEFORE
UPDATE ON public.collaborators FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ── 3. Indexes for performance ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_collaborators_slug ON public.collaborators (slug);
CREATE INDEX IF NOT EXISTS idx_collaborators_is_active ON public.collaborators (is_active);
CREATE INDEX IF NOT EXISTS idx_collaborators_full_name ON public.collaborators (full_name);
-- ================================================================
-- HOW TO BOOTSTRAP YOUR FIRST ADMIN:
-- 1. Create a user via Supabase Auth (Dashboard → Authentication → Users)
-- 2. Run: INSERT INTO public.user_roles (user_id, role)
--         VALUES ('<your-user-uuid>', 'admin');
-- ================================================================