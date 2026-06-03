-- ============================================================
-- WeekFlow — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- TABLE: tasks
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT        NOT NULL,          -- localStorage UUID
  workspace_id  TEXT        NULL,              -- NULL = personal task, else workspace id
  title         TEXT        NOT NULL,
  description   TEXT        NULL,
  day_of_week   SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_hour    SMALLINT    NOT NULL CHECK (start_hour BETWEEN 0 AND 23),
  duration      SMALLINT    NOT NULL DEFAULT 1 CHECK (duration BETWEEN 1 AND 24),
  color         TEXT        NOT NULL DEFAULT '#0A84FF',
  category      TEXT        NOT NULL DEFAULT 'work',
  is_done       BOOLEAN     NOT NULL DEFAULT FALSE,
  week_start    DATE        NOT NULL,           -- ISO Monday of the week
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_week      ON public.tasks (user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_week ON public.tasks (workspace_id, week_start);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (permissive for name-only auth)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow all operations (user_id is a UUID string managed client-side)
CREATE POLICY "allow_all" ON public.tasks FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- NOTE: For production with Supabase Auth, replace with:
--   USING (auth.uid()::text = user_id)

-- ─────────────────────────────────────────────────────────────
-- REALTIME — enable in Dashboard:
-- Database → Replication → supabase_realtime publication
-- → Add table: tasks
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- SAMPLE DATA (uncomment to test)
-- ─────────────────────────────────────────────────────────────
-- INSERT INTO public.tasks (user_id, title, day_of_week, start_hour, duration, color, category, week_start)
-- VALUES
--   ('test-user-1', 'Réunion équipe', 0, 9, 1, '#0A84FF', 'work', '2025-06-02'),
--   ('test-user-1', 'Sport matin',    0, 7, 1, '#FF9F0A', 'health', '2025-06-02'),
--   ('test-user-1', 'Code review',    2, 14, 2, '#BF5AF2', 'work', '2025-06-02');
