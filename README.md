# Allos — Scripture for the Season You're In

A Scripture-guided Christian encouragement web app built with Next.js, Supabase, and OpenAI.

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run `npm install`
4. Run the SQL in `supabase/schema.sql` in your Supabase project's SQL editor
5. Run `npm run dev`

## Environment Variables

- `OPENAI_API_KEY` — from platform.openai.com
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase service role key
- `NEXT_PUBLIC_APP_URL` — your deployment URL (e.g. https://word2go.com)

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)
- OpenAI GPT-4o-mini

## Routes

- `/` — Landing page
- `/app` — Main generation flow
- `/journey` — Saved entries
- `/entry/[id]` — Single entry
- `/auth/login` — Login
- `/auth/signup` — Sign up
