# Accompli Architecture

## Overview

Accompli is a special education platform designed to help teachers and aides manage IEP-aligned lessons, track real-time behavior events, and generate compliant progress reports. The system is built as a monorepo with multiple applications and services.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Web Portal    │    │   Mobile App    │
│   (Teachers)    │    │    (Aides)      │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌─────────────────┐
          │   API Gateway   │
          │   (FastAPI)     │
          └─────────┬───────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
┌────▼────┐   ┌────▼────┐   ┌────▼────┐
│   API   │   │Realtime │   │   LLM   │
│Service  │   │Service  │   │Service  │
└────┬────┘   └────┬────┘   └─────────┘
     │             │
     └─────────────┼─────────────┐
                   │             │
          ┌────────▼────┐   ┌────▼────┐
          │ PostgreSQL  │   │  Redis  │
          │ (Primary)   │   │(Cache/  │
          │             │   │ Queue)  │
          └─────────────┘   └─────────┘
```

## Core Components

### Web Application (`apps/web`)
- **Technology**: Next.js 14 with TypeScript, Tailwind CSS
- **Purpose**: Teacher and admin portal for comprehensive IEP management
- **Features**:
  - Dashboard with real-time behavior event feed
  - Student profile and IEP management
  - Lesson plan creation and management
  - Report generation and analytics
  - Real-time WebSocket integration

### Mobile Application (`apps/mobile`)
- **Technology**: React Native with Expo
- **Purpose**: Aide-focused app for quick behavior logging
- **Features**:
  - Offline-first behavior event logging
  - Quick ABC (Antecedent-Behavior-Consequence) forms
  - Background sync when online
  - Minimal UI optimized for speed

### API Service (`services/api`)
- **Technology**: FastAPI with Python, SQLModel/SQLAlchemy
- **Purpose**: Main REST API for all data operations
- **Features**:
  - Authentication and authorization (JWT)
  - Multi-tenant data isolation (org_id scoping)
  - CRUD operations for all entities
  - File upload with S3 presigned URLs
  - Audit logging for compliance

### Realtime Service (`services/realtime`)
- **Technology**: FastAPI with WebSockets
- **Purpose**: Real-time event broadcasting
- **Features**:
  - WebSocket connections for live updates
  - Event publishing to connected clients
  - Connection management and recovery

### Worker Service (`services/worker`)
- **Technology**: Celery with Redis
- **Purpose**: Background job processing
- **Features**:
  - Report generation (PDF/DOCX)
  - Email notifications
  - Data export jobs
  - Scheduled analytics updates

### LLM Service (`services/llm`)
- **Technology**: FastAPI with OpenAI integration
- **Purpose**: AI-powered content generation
- **Features**:
  - Progress note drafting
  - Behavior pattern analysis
  - IEP goal suggestions
  - PII redaction and validation

## Data Layer

### PostgreSQL Schema
- **Multi-tenancy**: All tables include `org_id` for data isolation
- **Core Entities**:
  - Organizations and Users
  - Students and IEPs
  - Goals and Probes
  - Behavior Events
  - Lesson Plans
  - Evidence/Files
  - Audit Logs

### Redis Usage
- **Session Storage**: User session data
- **Real-time Cache**: Recently accessed student data
- **Job Queue**: Celery task queue
- **WebSocket State**: Active connection tracking

## Security Model

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (TEACHER, AIDE, ADMIN)
- Organization-scoped data access

### Data Protection
- Encryption at rest (PostgreSQL with TDE)
- Encryption in transit (HTTPS/WSS)
- PII redaction in logs and AI interactions
- Audit logging for all data access

### FERPA Compliance
- Student data privacy controls
- Parental consent tracking
- Data retention policies
- Secure data deletion

## Offline Support

### Mobile Offline Strategy
- SQLite local database for event queuing
- Background sync with conflict resolution
- Optimistic UI updates
- Server reconciliation on reconnect

### Sync Protocol
1. Events stored locally with UUID
2. Background process attempts sync
3. Server validates and deduplicates
4. Client receives confirmation
5. Local events marked as synced

## Performance Requirements

### Response Times
- Behavior event creation: < 150ms
- Dashboard load: < 1s
- Report generation: < 30s (async)
- WebSocket reconnect: < 5s

### Scalability Targets
- 1000+ concurrent users
- 20+ behavior events per minute per classroom
- 10,000+ students per organization
- 99.9% uptime SLA

## Deployment Architecture

### Development
- Docker Compose for local development
- MinIO for S3-compatible storage
- Local PostgreSQL and Redis

### Production
- Kubernetes cluster on AWS/GCP
- RDS PostgreSQL with read replicas
- ElastiCache Redis cluster
- S3 for file storage
- CloudFront CDN
- Application Load Balancer

## Monitoring and Observability

### Logging
- Structured JSON logs
- Centralized logging with ELK stack
- PII-redacted error tracking with Sentry

### Metrics
- Application metrics with Prometheus
- Infrastructure monitoring with Grafana
- Real-time dashboards for key KPIs

### Health Checks
- Kubernetes liveness/readiness probes
- Database connection monitoring
- External service dependency checks
