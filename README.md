# Amy - Recruitment & Candidate Management Platform

A modern, minimalist recruitment platform with strict isolation, dual tenancy, and comprehensive import capabilities.

## 🏗️ Monorepo Structure

```
amy/
├── apps/
│   ├── web/        # Landing page (port 5173)
│   ├── app/        # Recruiter Dashboard (port 5174)
│   ├── admin/      # Admin Dashboard (port 5175)
│   └── api/        # Node.js API Server (port 3000)
├── packages/
│   ├── db/         # Prisma schema & client
│   ├── ui/         # Shared UI components
│   ├── config/     # Shared configuration
│   ├── auth/       # Authentication helpers
│   ├── jobs/       # Background job workers
│   └── utils/      # Shared utilities
└── docker/
    └── docker-compose.dev.yml
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, SESSION_SECRET
```

### 3. Start Development Services

```bash
# Start PostgreSQL, Redis, MinIO, MailHog
pnpm docker:dev
```

### 4. Set up Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with initial data
pnpm db:seed
```

### 5. Start Development Servers

```bash
# Start all apps concurrently
pnpm dev
```

This will start:

- **API Server**: http://localhost:3000
- **Landing Page**: http://localhost:5173
- **Recruiter Dashboard**: http://localhost:5174
- **Admin Dashboard**: http://localhost:5175

## 🔐 Default Credentials

After seeding the database:

- **Admin**: admin@amy.com / admin123
- **Demo Recruiter**: recruiter@demo.com / recruiter123

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev:api               # Start API only
pnpm dev:web               # Start landing page only
pnpm dev:app               # Start recruiter dashboard only
pnpm dev:admin             # Start admin dashboard only

# Database
pnpm db:generate           # Generate Prisma client
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed database
pnpm db:studio             # Open Prisma Studio

# Building
pnpm build                 # Build all apps
pnpm start                 # Start production servers

# Testing
pnpm test                  # Run unit tests
pnpm test:e2e              # Run E2E tests

# Linting
pnpm lint                  # Lint all apps
pnpm type-check            # Type check all apps
```

### Development Services

- **PostgreSQL**: localhost:5432 (amy/amy/amy)
- **Redis**: localhost:6379
- **MinIO**: localhost:9000 (amy/amy123) - Console: localhost:9001
- **MailHog**: localhost:1025 (SMTP) - Web UI: localhost:8025

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + TanStack Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Passport.js (Local + Google OAuth)
- **Styling**: Tailwind CSS + shadcn/ui (monochrome theme)
- **State Management**: TanStack Query
- **File Storage**: S3-compatible (MinIO for dev)
- **Background Jobs**: BullMQ + Redis
- **Testing**: Vitest + Playwright

### Key Features

- **Dual Tenancy**: Solo/Company modes with strict isolation
- **Multi-Import**: Google Drive, Airtable, Sheets, CSV, Excel
- **Full-Text Search**: PostgreSQL tsvector with GIN indexing
- **Pipeline Management**: Custom Kanban boards per recruiter
- **Admin Controls**: User management, assignments, monitoring
- **Trial & Subscriptions**: Built-in billing controls
- **Resume Parsing**: Local + external API support
- **Audit Logging**: Complete action tracking

## 🔒 Security Features

- Role-based access control (Admin/Recruiter)
- Strict data isolation between recruiters
- CSRF protection on all actions
- Rate limiting on API endpoints
- Input validation with Zod
- Secure session management
- Optional PostgreSQL RLS

## 📦 Deployment

### Production Build

```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### Docker Deployment

Each app has its own Dockerfile:

```bash
# Build API
docker build -t amy-api apps/api

# Build Web
docker build -t amy-web apps/web

# Build App (Recruiter Dashboard)
docker build -t amy-app apps/app

# Build Admin
docker build -t amy-admin apps/admin
```

### Hosting Recommendations

- **Backend**: Railway, Fly.io, or Render (~$5/month)
- **Database**: Neon (free tier) or Supabase
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **File Storage**: AWS S3, Cloudflare R2, or MinIO

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
pnpm test:e2e
```

### Test Coverage

Tests cover:

- Authentication flows
- Recruiter isolation
- Admin assignment workflows
- Import functionality
- Search relevance
- Trial expiry handling

## 📚 API Documentation

The API server runs on port 3000 with the following endpoints:

- `GET /healthz` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/candidates` - List candidates (scoped)
- `POST /api/candidates` - Create candidate
- `GET /api/search` - Full-text search
- `POST /api/imports/*` - Import endpoints
- `GET /api/admin/*` - Admin endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: [Coming soon]
- **Issues**: GitHub Issues
- **Email**: support@amy.com

## 🗺️ Roadmap

- [ ] Advanced search filters
- [ ] Candidate scoring algorithms
- [ ] Email automation
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Webhook support
- [ ] Multi-language support
# amy
# amy
