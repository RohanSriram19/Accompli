# Accompli

A comprehensive, research-informed special education platform that empowers teachers and aides with AI-powered tools to improve student outcomes while maintaining FERPA compliance.

## Missionompli

A comprehensive, research-informed special education platform that empowers teachers and aides with AI-powered tools to improve student outcomes while maintaining FERPA compliance.

##  Mission

Transforming special education through evidence-based technology that reduces administrative burden, enhances instructional quality, and improves student outcomes with research-backed interventions.

## Key Features

### Research-Aware AI Assistant
- **Evidence-Based Recommendations**: AI powered by peer-reviewed research from What Works Clearinghouse, Cochrane Reviews, NCII, and CEC
- **Real-time Research Integration**: Automatic matching of student conditions to proven interventions (71-88% effectiveness ratings)
- **Implementation Guidance**: Step-by-step guides based on research literature
- **Source Citations**: Full transparency with research source attribution

### IEP Management & Progress Tracking
- **Comprehensive IEP Data**: Individual Education Plans with goals, accommodations, and services
- **Smart Progress Monitoring**: Automated analysis of student progress patterns
- **Goal Alignment**: Lesson plans and interventions aligned to specific IEP objectives
- **Compliance Tracking**: FERPA-compliant data handling with audit trails

### Real-time Behavior Analytics
- **ABC Event Logging**: Antecedent-Behavior-Consequence tracking with pattern analysis
- **Intervention Effectiveness**: Data-driven insights on behavior intervention success
- **Real-time Dashboards**: Live behavior event feeds and trend analysis
- **Crisis Management**: Immediate alerts and response protocols

### Intelligent Lesson Planning
- **IEP-Aligned Activities**: Lessons automatically aligned to student goals
- **Research-Based Strategies**: Intervention recommendations from evidence database
- **Progress Integration**: Real-time adjustment based on student performance data
- **Collaborative Planning**: Multi-user lesson development and sharing

### Multi-Platform Access
- **Web Portal**: Full-featured dashboard for teachers and administrators
- **Mobile Support**: Responsive design for on-the-go access
- **Offline Capability**: Local data storage with automatic synchronization
- **Real-time Updates**: WebSocket integration for live collaboration

## Architecture

### Frontend Stack
- **Next.js 14+** with TypeScript and App Router
- **Tailwind CSS** for responsive, accessible design
- **TanStack Query** for efficient data fetching and caching
- **Zustand** for lightweight state management

### Backend Stack
- **FastAPI** with Python 3.11+ for high-performance APIs
- **SQLModel & PostgreSQL** for type-safe database operations
- **JWT Authentication** with role-based access control
- **Pydantic** for request/response validation

### AI & Research Integration
- **Research Knowledge Service** with 10+ evidence-based interventions
- **Dynamic Context Injection** for AI prompt enhancement
- **OpenAI Integration** with research-informed responses
- **Effectiveness Tracking** with outcome measurement

### Infrastructure
- **Docker Compose** for local development
- **Vercel** deployment for frontend
- **PostgreSQL** with connection pooling
- **Redis** for caching and session management

## Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm**
- **Python 3.11+**
- **PostgreSQL 12+**
- **OpenAI API Key** (for AI features)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/RohanSriram19/Accompli.git
   cd Accompli
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   # Frontend
   cd apps/web
   cp .env.example .env.local
   # Add your OpenAI API key to .env.local
   
   # Backend
   cd ../../services/api
   cp .env.example .env
   # Configure database URL and other settings
   ```

3. **Initialize the database:**
   ```bash
   cd services/api
   python init_db.py
   # Creates tables and optional sample data
   ```

4. **Start the development servers:**
   ```bash
   # Frontend (from project root)
   cd apps/web && npm run dev
   
   # Backend (in new terminal)
   cd services/api && python start_server.py
   ```

### Demo Accounts

Try the platform with pre-configured demo accounts:

- **Teacher**: `teacher@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`
- **Parent**: `parent@demo.com` / `demo123`

### Accessing Services

- **Web App**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Project Structure

```
Accompli/
├── apps/                    # Applications
│   ├── web/                   # Next.js teacher/admin portal
│   │   ├── src/app/          # App router pages
│   │   ├── src/components/   # React components
│   │   └── src/lib/          # Utilities & services
│   └── mobile/               # React Native aide app (planned)
├── services/              # Backend services
│   └── api/                  # FastAPI service
│       ├── app/core/        # Configuration & auth
│       ├── app/models/      # Database models
│       ├── app/routers/     # API endpoints
│       └── app/utils/       # Utility functions
├── packages/              # Shared libraries
│   └── schemas/             # TypeScript schemas
├── docs/                  # Documentation
│   ├── architecture.md      # System architecture
│   └── research-aware-ai-implementation.md
└── Configuration files
```

## Research Integration

### Evidence Database
- **10+ Evidence-Based Interventions** from peer-reviewed sources
- **Effectiveness Ratings** (71-88% success rates)
- **Implementation Guides** with step-by-step instructions
- **Population Matching** for appropriate intervention selection

### Research Sources
- **What Works Clearinghouse** (US Department of Education)
- **Cochrane Systematic Reviews**
- **National Center on Intensive Intervention**
- **Council for Exceptional Children**
- **National Professional Development Center on Autism**

## AI Features

### Research-Informed Chat
```typescript
// Example: AI provides research-backed recommendations
"What interventions work best for autism?"

Response includes:
- Specific interventions with effectiveness ratings
- Implementation steps from research
- Source citations from peer-reviewed literature
- Adaptation suggestions for individual students
```

### Contextual Student Support
- **IEP Data Integration**: AI aware of student's specific goals and accommodations
- **Progress Pattern Analysis**: Recommendations based on current performance trends
- **Intervention Matching**: Automatic selection of appropriate research-based strategies

## Available Commands

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all applications
pnpm test             # Run test suites
pnpm lint             # Lint all code

# Backend specific
cd services/api
python init_db.py     # Initialize database
python start_server.py # Start API server
uvicorn app.main:app --reload  # Manual server start

# Database management
python -c "from app.database import init_db; init_db()"  # Reset database
```

## Features Roadmap

### Completed
- [x] Research-aware AI assistant with evidence database
- [x] Comprehensive FastAPI backend with authentication
- [x] IEP management with progress tracking
- [x] Student profiles with behavior event logging
- [x] Real-time research recommendations
- [x] Web-based dashboard and student management

### In Progress
- [ ] Advanced behavior pattern analysis
- [ ] Parent/guardian portal
- [ ] Report generation and export
- [ ] Bulk data import/export

### Planned
- [ ] Mobile app for field data collection
- [ ] WebSocket real-time collaboration
- [ ] Advanced analytics and insights
- [ ] Integration with school information systems
- [ ] Multi-language support

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Add** tests for new functionality
4. **Submit** a pull request

### Development Guidelines
- Follow TypeScript strict mode
- Use meaningful commit messages
- Maintain FERPA compliance in all features
- Include tests for business logic
- Document API changes

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support & Documentation

- **API Documentation**: http://localhost:8000/docs (when running locally)
- **Issues**: [GitHub Issues](https://github.com/RohanSriram19/Accompli/issues)
- **Contact**: Open an issue for support

---

**Accompli** - Empowering special education through evidence-based technology
