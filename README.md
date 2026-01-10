# Outbreak Intel Dashboard

A global health intelligence and early signal detection dashboard for monitoring disease outbreaks worldwide. Built with Next.js, Supabase, and deployed on Vercel.

## Features

- **Real-time Outbreak Monitoring** - Track disease outbreaks and health signals globally
- **WHO DONs Integration** - Automated ingestion from WHO Disease Outbreak News
- **AI-Powered Analysis** - Gemini-powered signal classification and assessment
- **Interactive Dashboard** - Visualize trends, locations, and severity metrics
- **Alerting System** - Get notified about critical health events
- **Secure Authentication** - Supabase-based user authentication

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Python (ingestion pipeline), Next.js API routes |
| Database | Supabase (PostgreSQL) |
| AI/ML | Google Gemini API |
| Deployment | Vercel (frontend), GitHub Actions (backend automation) |

## Project Structure

```
outbreak-intel/
├── frontend-new/          # Next.js dashboard application
│   ├── src/
│   │   ├── app/           # App router pages and API routes
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities, auth, caching, rate limiting
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
├── backend/               # Python ingestion pipeline
│   ├── ingestion/         # Data fetchers and processors
│   └── requirements.txt   # Python dependencies
└── .github/workflows/     # GitHub Actions for automation
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Supabase account
- Google AI Studio API key (for Gemini)

### Frontend Setup

```bash
cd frontend-new
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python -m ingestion.main
```

## Security Features

This application includes production-hardened security:

| Feature | Description |
|---------|-------------|
| **Security Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **API Authentication** | All API routes require valid Supabase session |
| **Rate Limiting** | Per-user rate limits with 429 responses |
| **Input Validation** | Environment variable validation at startup |
| **Open Redirect Protection** | Validated redirect paths with allowlist |
| **Error Handling** | Proper HTTP status codes, no data leakage |

## API Routes

| Endpoint | Description | Rate Limit |
|----------|-------------|------------|
| `GET /api/events` | Fetch normalized outbreak events | 30/min |
| `GET /api/alerts` | Fetch unread alerts | 30/min |
| `GET /api/overview` | Dashboard statistics | 20/min |
| `GET /api/diseases` | Disease reference data | 20/min |
| `GET /api/health` | System health and pipeline status | 10/min |

All endpoints require authentication and return proper error responses.

## Deployment

### Vercel (Frontend)

1. Import project from GitHub
2. Set root directory to `frontend-new`
3. Add environment variables in Vercel dashboard
4. Deploy

### GitHub Actions (Backend)

The ingestion pipeline runs daily via GitHub Actions. Configure these secrets:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

## Database Schema

Key tables in Supabase:

- `normalized_events` - Processed outbreak signals
- `diseases` - Disease reference data
- `alerts` - User notifications
- `location_mentions` - Geographic data
- `pipeline_runs` - Ingestion run history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to verify
5. Submit a pull request

## License

Private - QuantumOps Private Limited

---

**Live Demo:** [outbreak-intel.vercel.app](https://frontend-1cj644tfa-praneeths-projects-c3c89914.vercel.app)
