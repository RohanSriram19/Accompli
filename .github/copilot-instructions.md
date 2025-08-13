<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Accompli Project Instructions

This is a special education platform monorepo with the following key components:

## Tech Stack
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, TanStack Query, Zustand
- **Mobile**: React Native with Expo, SQLite for offline storage
- **Backend**: FastAPI with Python, SQLAlchemy/SQLModel, Pydantic
- **Database**: PostgreSQL with Alembic migrations
- **Cache/Queue**: Redis with Celery for background jobs
- **Storage**: S3-compatible (MinIO for development)
- **Real-time**: WebSockets with Socket.IO

## Key Domain Concepts
- **IEP**: Individual Education Plan with goals and accommodations
- **ABC Events**: Antecedent-Behavior-Consequence behavior tracking
- **Lesson Plans**: Educational activities aligned to IEP goals
- **Progress Notes**: Daily reports and student progress summaries
- **FERPA Compliance**: Student privacy and data protection requirements

## Code Style Guidelines
- Use TypeScript strictly with proper typing
- Follow functional programming patterns where possible
- Implement proper error handling with Result/Option patterns
- Use dependency injection for services
- Write comprehensive tests for all business logic
- Follow SOLID principles and clean architecture

## Security Requirements
- All endpoints require authentication and authorization
- Implement org-scoped data access (multi-tenancy)
- Audit all data access and modifications
- Encrypt sensitive data at rest and in transit
- Redact PII in logs and AI interactions

## Performance Requirements
- Offline-first mobile design with sync queues
- Real-time updates under 150ms for behavior logging
- WebSocket reconnection within 5 seconds
- Support for 20+ concurrent behavior events per minute

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
