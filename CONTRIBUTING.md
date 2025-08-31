# Contributing to Accompli

Thank you for your interest in contributing to Accompli! We welcome contributions from developers who want to help improve special education technology.

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js 18+** and **pnpm**
- **Python 3.11+**
- **PostgreSQL 12+**
- **Git** for version control
- **OpenAI API Key** for AI features (development)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Accompli.git
   cd Accompli
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up your development environment**:
   ```bash
   # Frontend
   cd apps/web
   cp .env.example .env.local
   # Add your OpenAI API key and other required variables
   
   # Backend
   cd ../../services/api
   cp .env.example .env
   # Configure database URL and settings
   ```

5. **Initialize the database**:
   ```bash
   cd services/api
   python init_db.py
   ```

6. **Start development servers**:
   ```bash
   # Frontend
   cd apps/web && npm run dev
   
   # Backend (new terminal)
   cd services/api && python start_server.py
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict mode and proper typing
- **Python**: Follow PEP 8 style guidelines
- **React**: Use functional components with hooks
- **API**: Follow REST conventions and OpenAPI standards

### Commit Messages

Use conventional commit format:

```
type(scope): description

Examples:
feat(ai): add research-based intervention recommendations
fix(auth): resolve JWT token expiration handling
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd apps/web
npm run test

# Backend tests
cd services/api
pytest
```

### Writing Tests

- **Frontend**: Jest + React Testing Library
- **Backend**: pytest with FastAPI test client
- **Coverage**: Aim for >80% test coverage on new code

### Test Requirements

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI interactions
- End-to-end tests for critical user flows

## 🔒 Security & Privacy

### FERPA Compliance

- **Never commit real student data** to the repository
- **Use sample/mock data** for testing and demos
- **Encrypt sensitive data** at rest and in transit
- **Follow privacy-by-design** principles

### Security Best Practices

- **Validate all inputs** on both client and server
- **Use parameterized queries** to prevent SQL injection
- **Implement proper authentication** and authorization
- **Keep dependencies updated** for security patches

## 📊 Types of Contributions

### 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node/Python versions)
- **Screenshots or logs** if helpful

### 💡 Feature Requests

For new features, please provide:

- **Problem statement**: What challenge does this solve?
- **User story**: Who benefits and how?
- **Research basis**: Is this evidence-based?
- **Implementation ideas**: Technical approach suggestions
- **FERPA considerations**: Privacy implications

### 🔬 Research Integration

We especially welcome contributions that:

- Add **evidence-based interventions** from peer-reviewed sources
- Improve **research matching algorithms** for student conditions
- Enhance **implementation guidance** with step-by-step instructions
- Integrate **new research databases** or sources

### 📚 Documentation

Help improve documentation by:

- **Updating README** with new features
- **Adding code comments** for complex logic
- **Creating tutorials** for new features
- **Improving API documentation**

## 🚀 Pull Request Process

### Before Submitting

- [ ] **Code follows style guidelines**
- [ ] **Tests pass locally**
- [ ] **No sensitive data** in commits
- [ ] **Documentation updated** if needed
- [ ] **FERPA compliance** reviewed

### PR Checklist

1. **Create descriptive title** and detailed description
2. **Link related issues** using keywords (fixes #123)
3. **Add screenshots** for UI changes
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally

### Review Process

1. **Automated checks** must pass (tests, linting, security)
2. **Code review** by at least one maintainer
3. **Privacy review** for features handling student data
4. **Merge** after approval and checks

## 🏗️ Architecture Guidelines

### Frontend (Next.js)

- **Server Components** for data fetching when possible
- **Client Components** only when needed for interactivity
- **TypeScript strict mode** for type safety
- **Tailwind CSS** for consistent styling
- **Shadcn/ui components** for UI consistency

### Backend (FastAPI)

- **SQLModel** for database operations
- **Pydantic** for data validation
- **JWT** for authentication
- **Background tasks** for async operations
- **OpenAPI** documentation for all endpoints

### Database

- **PostgreSQL** as the primary database
- **Proper relationships** and foreign keys
- **Migrations** for schema changes
- **Audit trails** for sensitive operations

## 🎯 Special Education Focus

### Domain Expertise

When contributing, consider:

- **IEP requirements** and special education law
- **Evidence-based practices** in special education
- **Accessibility requirements** for diverse learners
- **Teacher workflow** and classroom realities

### Research Standards

- **Peer-reviewed sources** for intervention recommendations
- **Effect sizes** and evidence quality ratings
- **Implementation fidelity** considerations
- **Cultural responsiveness** in recommendations

## 📞 Getting Help

### Community Support

- **GitHub Discussions** for questions and ideas
- **Issues** for bug reports and feature requests
- **Code review** for technical feedback

### Maintainer Contact

- Open an **issue** for technical questions
- Tag **@RohanSriram19** for urgent matters
- Use **discussions** for general questions

## 📈 Recognition

Contributors will be recognized through:

- **Contributor list** in README
- **Release notes** mentioning contributions
- **GitHub contributor graph** visibility
- **Special recognition** for significant contributions

## 📄 License

By contributing to Accompli, you agree that your contributions will be licensed under the **MIT License**.

---

Thank you for helping improve special education technology! 🌟
