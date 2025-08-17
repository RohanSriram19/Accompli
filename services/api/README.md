# Accompli API Backend

A comprehensive FastAPI backend for the Accompli special education platform, providing secure API endpoints for IEP management, behavior tracking, lesson planning, and progress reporting.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 12+
- pip or conda

### Installation

1. **Navigate to the API directory:**
   ```bash
   cd services/api
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize the database:**
   ```bash
   python init_db.py
   ```

6. **Start the development server:**
   ```bash
   python start_server.py
   # Or manually: uvicorn app.main:app --reload
   ```

## 📚 API Documentation

Once the server is running, access:

- **Interactive API Docs:** http://localhost:8000/docs
- **ReDoc Documentation:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

## 🔐 Authentication

The API uses JWT token-based authentication:

1. **Register/Login** at `/api/v1/auth/login`
2. **Include token** in requests: `Authorization: Bearer <token>`
3. **Refresh tokens** at `/api/v1/auth/refresh`

### Sample Users (Development)

When using sample data:
- **Admin:** admin@springfield.edu (password: password)
- **Teacher:** teacher@springfield.edu (password: password)

## 🗃️ Database Models

### Core Entities

- **Users:** Authentication and role management
- **Organizations:** School districts and institutions
- **Students:** Student profiles and demographic data
- **IEPs:** Individualized Education Programs
- **IEP Goals:** Specific measurable objectives
- **Behavior Events:** Incident tracking and documentation
- **Lesson Plans:** Educational planning and activities
- **Evidence:** Progress documentation and file attachments

### Relationships

```
Organization -> Users, Students
Student -> IEP -> IEP Goals -> Evidence
Student -> Behavior Events, Lesson Plans
```

## 🛠️ API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - User authentication
- `POST /signup` - User registration
- `GET /me` - Current user profile
- `POST /refresh` - Token refresh

### Students (`/api/v1/students`)
- `GET /` - List students (with filtering)
- `POST /` - Create student
- `GET /{id}` - Get student details
- `PATCH /{id}` - Update student
- `DELETE /{id}` - Delete student

### IEP Goals (`/api/v1/goals`)
- `GET /` - List goals (with filtering)
- `POST /` - Create goal
- `GET /{id}` - Get goal details
- `PATCH /{id}` - Update goal progress
- `DELETE /{id}` - Delete goal

### Behavior Events (`/api/v1/behavior-events`)
- `GET /` - List behavior events (with filtering)
- `POST /` - Log behavior event
- `GET /{id}` - Get event details
- `PATCH /{id}` - Update event
- `DELETE /{id}` - Delete event

### Lesson Plans (`/api/v1/lesson-plans`)
- `GET /` - List lesson plans
- `POST /` - Create lesson plan
- `GET /templates` - Get plan templates
- `GET /{id}` - Get plan details
- `PATCH /{id}` - Update plan
- `DELETE /{id}` - Delete plan

### Evidence (`/api/v1/evidence`)
- `GET /` - List evidence records
- `POST /` - Create evidence
- `POST /upload` - Upload evidence files
- `GET /goal/{goal_id}` - Get evidence for goal
- `PATCH /{id}` - Update evidence
- `DELETE /{id}` - Delete evidence

### Reports (`/api/v1/reports`)
- `GET /student/{id}/progress` - Student progress report
- `GET /behavior/trends` - Behavior trend analysis
- `GET /goals/summary` - Goals summary statistics

### Analytics (`/api/v1/analytics`)
- `GET /dashboard` - Dashboard overview stats
- `GET /student-performance` - Performance analytics
- `GET /behavior-patterns` - Behavior pattern analysis
- `GET /goal-effectiveness` - Goal effectiveness metrics

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/accompli"

# Security
SECRET_KEY="your-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_V1_PREFIX="/api/v1"
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
ALLOWED_HOSTS=["localhost", "127.0.0.1"]

# Logging
LOG_LEVEL="INFO"
```

### Database Configuration

The application uses SQLModel with PostgreSQL. Key features:

- **Automatic migrations** on startup
- **Connection pooling** for performance
- **FERPA-compliant** data handling
- **Audit trails** for sensitive operations

## 📊 Development Features

### Sample Data

The initialization script creates:
- Sample organization (Springfield Elementary)
- Admin and teacher users
- Student profiles with IEPs
- Goals with progress tracking
- Behavior events and lesson plans

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py
```

### Code Quality

```bash
# Format code
black app/
isort app/

# Lint code
flake8 app/
mypy app/
```

## 🏗️ Architecture

### Project Structure

```
services/api/
├── app/
│   ├── core/           # Configuration and utilities
│   │   ├── auth.py     # JWT authentication
│   │   ├── config.py   # Settings management
│   │   └── logging.py  # Logging configuration
│   ├── models/         # Database models
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── iep.py
│   │   └── ...
│   ├── routers/        # API route handlers
│   │   ├── auth.py
│   │   ├── students.py
│   │   └── ...
│   ├── database.py     # Database connection
│   └── main.py         # FastAPI application
├── tests/              # Test suite
├── init_db.py          # Database initialization
├── start_server.py     # Development server
└── pyproject.toml      # Dependencies and config
```

### Key Design Patterns

- **Repository Pattern:** Clean data access layer
- **Dependency Injection:** FastAPI's dependency system
- **Schema Validation:** Pydantic models for request/response
- **Authentication:** JWT middleware for secure access
- **Error Handling:** Consistent HTTP error responses

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** bcrypt for password security
- **CORS Protection:** Configurable origin restrictions
- **Input Validation:** Pydantic schema validation
- **SQL Injection Protection:** SQLModel query building
- **FERPA Compliance:** Education data privacy standards

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t accompli-api .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  accompli-api
```

### Production Considerations

- Use production-grade WSGI server (Gunicorn)
- Configure database connection pooling
- Set up proper logging and monitoring
- Enable HTTPS with reverse proxy
- Configure backup and disaster recovery

## 📈 Monitoring & Observability

### Health Checks

- `GET /health` - Application health status
- Database connectivity validation
- Memory and performance metrics

### Logging

- Structured JSON logging
- Request/response logging
- Error tracking with stack traces
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Development Workflow

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run pre-commit hooks
pre-commit install

# Run full test suite
make test

# Start development server
make dev
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the [API Documentation](http://localhost:8000/docs)
2. Review the [GitHub Issues](../../issues)
3. Contact the development team

---

**Accompli API** - Empowering special education with technology 🎓
