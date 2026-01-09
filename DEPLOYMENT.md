# Deployment Guide

This application is built with Next.js and python, designed to be deployed on **Vercel** (Frontend) and **GitHub Actions** (Backend Automation).

## 1. Frontend Deployment (Vercel)
The easiest way to deploy the dashboard is using Vercel.

### Prerequisites
- A [Vercel Account](https://vercel.com).
- The project pushed to a Git repository (GitHub/GitLab/Bitbucket).

### Steps
1.  **Import Project**: Go to Vercel Dashboard > "Add New..." > "Project" and select your repository `outbreak-intel`.
2.  **Configure Project**:
    - **Framework Preset**: Next.js (Auto-detected)
    - **Root Directory**: `frontend-new` (Valid since your Next.js app is in a subdirectory)
3.  **Environment Variables**:
    Add the following variables in the Vercel Project Settings:
    - `NEXT_PUBLIC_SUPABASE_URL`: `https://iqclrydtltiqxrygkrsz.supabase.co`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_f3V9SodITwsg8DsLDN2uEQ_7_pUXyzL`
4.  **Deploy**: Click "Deploy". Vercel will build and host the application.

## 2. Backend Automation (GitHub Actions)
The backend pipeline runs automatically via GitHub Actions.

### Configuration
Ensure your GitHub Repository has the following **Secrets** configured (Settings > Secrets and variables > Actions):
- `SUPABASE_URL`: `https://iqclrydtltiqxrygkrsz.supabase.co`
- `SUPABASE_KEY`: `sb_publishable_f3V9SodITwsg8DsLDN2uEQ_7_pUXyzL` (Anon Key)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Service Role Key (starts with `ey...`)
- `GEMINI_API_KEY`: Your Google AI Studio Key

### Schedule
- The workflow `.github/workflows/daily_ingestion.yml` runs daily at **00:00 UTC**.
- You can manually trigger it from the "Actions" tab in GitHub.

## 3. Database
Your Database is hosted on **Supabase**.
- **Production URL**: `https://iqclrydtltiqxrygkrsz.supabase.co`
- **Tables**: `alerts`, `diseases`, `normalized_events`, `raw_events`, `sources` etc.
