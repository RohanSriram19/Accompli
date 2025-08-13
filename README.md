# Accompli

A comprehensive special education platform for teachers and aides to plan IEP-aligned lessons, log real-time behavior events, and generate compliant reports.

## 🎯 Mission

Empowering special education professionals with modern tools to improve student outcomes while maintaining FERPA compliance and reducing administrative burden.

## ✨ Features

- **IEP Management**: View and manage Individual Education Plans with goals and accommodations
- **Real-time Behavior Logging**: ABC (Antecedent-Behavior-Consequence) event tracking with offline support
- **Lesson Planning**: Create and manage lessons aligned to IEP goals
- **Progress Reports**: Generate compliant daily notes and progress summaries
- **Multi-platform**: Web portal for teachers/admins, mobile app for aides
- **FERPA Compliant**: Privacy-first design with data encryption and audit logging
- **Offline-First**: Mobile app works without internet, syncs when connected
- **Real-time Updates**: WebSocket integration for live collaboration

## Architecture

- **Web App**: Next.js with TypeScript, Tailwind CSS, TanStack Query
- **Mobile App**: React Native (Expo) with offline-first design
- **API Services**: FastAPI with Python, PostgreSQL, Redis
- **Real-time**: WebSocket integration for live updates
- **File Storage**: S3-compatible storage with MinIO for development
- **Background Jobs**: Celery with Redis for async processing
- **LLM Service**: Dedicated microservice for AI-powered features

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- pnpm

### Development Setup

1. Clone and install dependencies:
   ```bash
   git clone <repo-url>
   cd accompli
   pnpm install
   ```

2. Copy environment files:
   ```bash
   cp .env.example .env
   ```

3. Start development services:
   ```bash
   make dev
   ```

4. Run database migrations:
   ```bash
   make db-migrate
   ```

### Available Commands

- `make dev` - Start all services in development mode
- `make build` - Build all services for production
- `make test` - Run all tests
- `make lint` - Lint all code
- `make db-reset` - Reset and seed database

## Project Structure

```
accompli/
├── apps/                    # Applications
│   ├── web/                # Next.js teacher/admin portal
│   └── mobile/             # React Native aide app
├── services/               # Backend services
│   ├── api/               # Main FastAPI service
│   ├── realtime/          # WebSocket service
│   ├── worker/            # Background job processor
│   └── llm/               # LLM microservice
├── packages/              # Shared libraries
│   ├── ui/               # Shared UI components
│   ├── schemas/          # TypeScript/OpenAPI schemas
│   └── common/           # Shared utilities
├── infra/                # Infrastructure
│   ├── terraform/        # Infrastructure as code
│   ├── k8s/             # Kubernetes manifests
│   └── docker/          # Dockerfiles
└── docs/                # Documentation
```

## License

MIT
