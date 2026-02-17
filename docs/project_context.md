# Project Context - SR Calculator

---

## 1. Project Overview

**SR Calculator** is a retirement planning web application that calculates future corpus projections using SIP (Systematic Investment Plan) contributions. Users can register, save their retirement planning data, and retrieve it later.

**Target Users:** Individual investors planning for retirement

**Problem Solved:** Most retirement calculators make errors like applying inflation during accumulation or using wrong compounding formulas. This calculator implements a mathematically correct two-phase model with data persistence.

---

## 2. Business Objective

| Objective | Details |
|-----------|---------|
| **Primary Goal** | Portfolio demo for DevOps job interview |
| **Deadline** | This Friday |
| **Audience** | Interviewers evaluating cloud/DevOps skills |
| **Success Metric** | Live AWS demo + clean architecture diagram |
| **Budget** | Deploy only for demos, destroy after (~$80/month when running) |

**Why this exists:** Demonstrate practical skills in:
- Infrastructure as Code (Terraform)
- Containerization (Docker, ECS)
- Cloud Architecture (AWS VPC, RDS, ALB)
- Database Management (PostgreSQL)
- Security (Secrets Manager, private subnets)

---

## 3. Core Features (MVP Scope)

### Must Have (MVP)
- [x] Retirement corpus calculator with SIP projections
- [x] Two-phase calculation model (Accumulation + Withdrawal)
- [x] Corpus longevity simulation (how long money lasts)
- [x] User registration (Name, Email, Phone, Age)
- [x] User login (email-based)
- [x] Save/Retrieve calculations (PostgreSQL)
- [x] Docker containerization
- [x] Terraform scripts for AWS infrastructure
- [x] Live AWS deployment (ECS + ALB + RDS)
- [x] Basic responsive UI

### Nice to Have (Post-MVP)
- [ ] Password authentication
- [ ] Multiple scenario comparison
- [ ] Email notifications

---

## 4. Non-Goals (Important)

This project will **NOT** include:

| Category | Exclusion | Reason |
|----------|-----------|--------|
| Orchestration | No Kubernetes | ECS Fargate is sufficient for demo |
| Architecture | No microservices | Monolith is simpler, faster to build |
| Frontend | No mobile app | Web-only for demo |
| Infrastructure | No multi-region | Single region (ap-south-1) is enough |
| Database | No Aurora, No Redis | PostgreSQL on RDS is sufficient |
| Domain | No custom domain | Will use ALB DNS name |
| CI/CD | No complex pipelines | Manual deployment for demo |
| Monitoring | No Grafana/Prometheus | CloudWatch basic logs only |
| Auth | No OAuth/SSO | Simple email-based login |

---

## 5. Architecture Constraints

| Constraint | Requirement |
|------------|-------------|
| **Containerization** | Must be fully containerized with Docker |
| **Infrastructure** | Must use Terraform (IaC) - no manual AWS console changes |
| **Database** | Must persist user data in PostgreSQL (RDS) |
| **Security** | Database must be in private subnet |
| **Secrets** | Must use AWS Secrets Manager (no secrets in code) |
| **Cost** | Must support `terraform destroy` for demo cleanup |
| **Principles** | Must follow 12-factor app principles |

---

## 6. Technology Stack

> ⚠️ **LOCKED**: Do not change without explicit instruction.

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js 15 + React 19 + TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **Backend API** | Next.js API Routes | Latest |
| **Database** | PostgreSQL | 15.x |
| **ORM** | Prisma | Latest |
| **Container Runtime** | Docker + Docker Compose | Latest |
| **Container Registry** | AWS ECR | - |
| **Container Orchestration** | AWS ECS Fargate | - |
| **Load Balancer** | AWS Application Load Balancer | - |
| **Database Hosting** | AWS RDS | db.t3.micro |
| **IaC Tool** | Terraform | 1.9+ |
| **Cloud Provider** | AWS (ap-south-1) | - |
| **Monitoring** | AWS CloudWatch | - |

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS Application Load Balancer                   │
│              (Public Subnet - Port 80)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ECS Fargate (Private Subnet)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Next.js App Container (Port 3000)          │  │
│  │            - Frontend UI                              │  │
│  │            - API Routes (Auth, Calculations)          │  │
│  │            - Prisma ORM                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  RDS PostgreSQL (Private Subnet)             │
│                  Port 5432 - Users & Calculations            │
│                  Secrets Manager for credentials             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Definition of Done

The project is complete when **ALL** of the following are true:

### Code Quality
- [x] All MVP features implemented and working
- [x] TypeScript with no `any` types in production code
- [x] ESLint passes with no errors

### Deployment
- [x] Docker Compose works locally
- [x] Docker image builds and runs
- [ ] Terraform `apply` succeeds on AWS
- [ ] Live URL accessible via ALB DNS name
- [ ] Database accepts connections
- [ ] `terraform destroy` cleans up all resources

### Documentation
- [x] README contains setup instructions
- [x] README contains deployment instructions
- [x] Architecture diagram exists in docs/
- [x] .env.example file exists

### Testing
- [ ] Health check endpoint works (`/api/health`)
- [ ] User can register
- [ ] User can login and see saved data
- [ ] Calculator produces correct results

### Operations
- [x] Logs are structured (JSON format)
- [x] Health check endpoint exists (`/api/health`)
- [x] Environment-based configuration

### Interview Ready
- [ ] Can explain architecture in 2 minutes
- [ ] Can demo live application
- [ ] Can show Terraform code
- [ ] Can explain cost optimization strategy

---

## 9. Retirement Calculation Logic Summary

### Two-Phase Model

**Phase 1: Accumulation (Pre-Retirement)**
- Uses nominal expected portfolio returns
- Inflation NOT applied during accumulation
- Monthly SIP treated as ordinary annuity

**Phase 2: Withdrawal (Post-Retirement)**
- Uses real returns (nominal - inflation)
- Expenses are inflation-adjusted
- Iterative corpus depletion simulation

### Key Formulas

**Future Value of Monthly SIP:**
```
FV_SIP = monthly_contribution × [((1 + monthly_rate)^total_months - 1) / monthly_rate]
```

**Future Value of Current Savings:**
```
FV_CURRENT = current_savings × (1 + monthly_rate)^total_months
```

**Real Post-Retirement Return:**
```
REAL_RETURN = ((1 + nominal_rate) / (1 + inflation_rate)) - 1
```

### Guardrails
- `years_to_retirement > 0`
- `total_months >= 12` (minimum investment horizon)
- `monthly_return_rate < 0.02` (guardrail against rate misuse)

---

## 10. Database Schema

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (cuid) |
| email | String | Unique email address |
| name | String | User's name |
| phone | String? | Optional phone number |
| age | Int | User's age |
| createdAt | DateTime | Registration timestamp |

### Calculations Table
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (cuid) |
| userId | String | Foreign key to Users |
| currentAge | Int | Age at calculation |
| retirementAge | Int | Target retirement age |
| currentSavings | Float | Initial corpus |
| monthlyContribution | Float | Monthly SIP amount |
| expectedAnnualReturnRate | Float | Expected returns |
| retirementCorpus | Float? | Calculated result |
| createdAt | DateTime | Calculation timestamp |

---

## 11. Current Status

**Milestone:** M3 Completed - Terraform + Database
**Phase:** Ready for AWS deployment
**Session:** 0
**Last Updated:** Session 0 (Final)

---

## 12. References

| Document | Location |
|----------|----------|
| Calculation Formulas | `/upload/Retirement Projection Logic.txt` |
| AI Workflow | `/upload/BOOTLOADER_PROMPT.md` |
| Agent Conventions | `/upload/Agents.md` |
| Decisions Log | `docs/decisions_log.md` |
| Session Summary | `docs/session_summary.md` |
