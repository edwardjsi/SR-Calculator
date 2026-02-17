# Decisions Log - SR Calculator

This document tracks all significant technical and architectural decisions made during development.

---

## Decision Log Format

Each entry follows this format:
```
### [DEC-XXX] Decision Title
- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Context:** Why this decision was needed
- **Decision:** What was decided
- **Consequences:** Impact of this decision
```

---

## Architecture Decisions

### [DEC-001] Two-Phase Retirement Calculation Model
- **Date:** Pre-project
- **Status:** Accepted
- **Context:** Need to accurately model retirement planning with different behaviors before and after retirement
- **Decision:** Implement two-phase model:
  - Accumulation Phase: Use nominal returns only, no inflation adjustment
  - Withdrawal Phase: Use real returns, inflation-adjusted expenses
- **Consequences:** More accurate projections, prevents common calculator errors

---

### [DEC-002] Monthly Compounding for SIP
- **Date:** Pre-project
- **Status:** Accepted
- **Context:** SIP contributions are made monthly
- **Decision:** Use monthly compounding (ordinary annuity formula)
- **Consequences:** More accurate than annual compounding

---

### [DEC-003] Technology Stack Selection
- **Date:** Pre-project
- **Status:** Accepted
- **Context:** Need modern, maintainable technology stack
- **Decision:**
  - Frontend: Next.js 15 + React 19 + TypeScript
  - Database: PostgreSQL 15 (RDS)
  - ORM: Prisma
  - Infrastructure: AWS (ECS, RDS, ALB) + Terraform
- **Consequences:** Modern tooling, strong TypeScript typing, AWS-ready

---

### [DEC-004] Containerization Strategy
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Need consistent development and deployment environments
- **Decision:** Docker-first approach with multi-stage builds
- **Consequences:** Consistent environments, easier AWS deployment

---

### [DEC-005] Infrastructure as Code
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Need reproducible, version-controlled infrastructure
- **Decision:** Use Terraform with modular structure (VPC, ECS, ALB, RDS, IAM)
- **Consequences:** Reproducible infrastructure, easy to destroy/recreate

---

### [DEC-006] Project Name
- **Date:** Session 0
- **Status:** Accepted
- **Context:** User preference for shorter name
- **Decision:** Name project "SR Calculator"
- **Consequences:** Repository: https://github.com/edwardjsi/SR-Calculator

---

### [DEC-007] Next.js Monolith Architecture
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Tight deadline, need to minimize complexity
- **Decision:** Single Next.js application with API routes
- **Consequences:** Faster development, simpler deployment

---

### [DEC-008] MVP Scope
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Prevent scope creep with limited time
- **Decision:** Exclude Kubernetes, microservices, custom domain, OAuth
- **Consequences:** Focused development, achievable deadline

---

### [DEC-009] Database Persistence Required
- **Date:** Session 0
- **Status:** Accepted
- **Context:** DevOps project needs data persistence to be interview-worthy
- **Decision:** Add PostgreSQL database with user registration/login
- **Consequences:** 
  - Users can register with name, email, phone, age
  - Calculations are saved and retrievable
  - Adds ~$15/month to AWS cost
  - Demonstrates database skills

---

### [DEC-010] Simple Email-Based Auth
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Need authentication but no time for complex OAuth
- **Decision:** Simple email-only login (no password for MVP)
- **Consequences:** Quick to implement, good enough for demo

---

### [DEC-011] Indian Currency Formatting
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Primary audience is Indian investors
- **Decision:** Format currency in Lakhs/Crores (₹10L, ₹3.5 Cr)
- **Consequences:** Better UX for target users

---

### [DEC-012] AWS Region Selection
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Need to choose AWS region
- **Decision:** Use ap-south-1 (Mumbai) for cost efficiency
- **Consequences:** Lower latency for Indian users, cost effective

---

### [DEC-013] Secrets Management
- **Date:** Session 0
- **Status:** Accepted
- **Context:** Need to store database credentials securely
- **Decision:** Use AWS Secrets Manager for DB credentials
- **Consequences:** No hardcoded passwords, follows security best practices

---

## Decision History

| Date | Milestone | Decisions Made |
|------|-----------|----------------|
| Session 0 | Full Build | DEC-001 to DEC-013 |

---

## Pending Decisions

| ID | Title | Status | Priority |
|----|-------|--------|----------|
| DEC-014 | CI/CD pipeline | Pending | Post-MVP |
| DEC-015 | SSL/HTTPS | Pending | Medium |

---

*This document tracks all architectural decisions for the SR Calculator project.*
