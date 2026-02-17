# SR Calculator

> **Retirement Projection Engine** - A full-stack retirement planning application with mathematically correct two-phase calculation model.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20RDS%20%7C%20ALB-orange?logo=amazon-aws)
![Terraform](https://img.shields.io/badge/Terraform-1.9+-7B42BC?logo=terraform)

---

## 🎯 Overview

SR Calculator helps users plan their retirement by calculating future corpus projections using SIP (Systematic Investment Plan) contributions. Unlike many calculators that make errors like applying inflation during accumulation, this implements a **mathematically correct two-phase model**:

- **Phase 1 (Accumulation):** Uses nominal returns, no inflation adjustment
- **Phase 2 (Withdrawal):** Uses real returns, inflation-adjusted expenses

---

## ✨ Features

- 📊 **Accurate Retirement Projections** - Two-phase calculation model
- 💰 **SIP Calculator** - Monthly contribution compounding
- ⏱️ **Corpus Longevity** - How long your savings will last
- 📱 **Responsive Design** - Works on desktop and mobile
- 🐳 **Docker Ready** - Containerized for easy deployment
- ☁️ **AWS Deployment** - Terraform scripts included

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Docker (optional)

### Local Development

```bash
# Clone the repository
git clone https://github.com/edwardjsi/SR-Calculator.git
cd SR-Calculator

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
# Build and run with Docker
docker build -t sr-calculator .
docker run -p 3000:3000 sr-calculator
```

---

## 📐 Calculation Logic

### Inputs

| Parameter | Description | Example |
|-----------|-------------|---------|
| Current Age | Your current age | 30 |
| Retirement Age | Target retirement age | 60 |
| Current Savings | Existing retirement savings | ₹5,00,000 |
| Monthly SIP | Monthly contribution amount | ₹10,000 |
| Expected Return | Annual portfolio return rate | 12% |
| Monthly Expense | Current monthly expenses | ₹30,000 |
| Inflation Rate | Expected inflation | 6% |
| Post-Retirement Return | Conservative return after retirement | 8% |

### Formulas

**Future Value of SIP:**
```
FV_SIP = monthly_contribution × [((1 + monthly_rate)^n - 1) / monthly_rate]
```

**Future Value of Current Savings:**
```
FV_CURRENT = current_savings × (1 + monthly_rate)^n
```

**Real Return (Post-Retirement):**
```
REAL_RETURN = ((1 + nominal_rate) / (1 + inflation_rate)) - 1
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS Application Load Balancer                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ECS Fargate (Next.js App)                   │
│              Retirement Calculator + API                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  RDS PostgreSQL (Optional)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
sr-calculator/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main calculator UI
│   │   ├── layout.tsx         # Root layout
│   │   └── api/
│   │       ├── calculate/     # Calculation API
│   │       └── health/        # Health check endpoint
│   ├── lib/
│   │   └── calculator.ts      # Core calculation logic
│   └── components/ui/         # UI components (shadcn)
├── terraform/                 # AWS infrastructure
├── docs/                      # Documentation
└── docker-compose.yml         # Local development
```

---

## 🔌 API Endpoints

### POST `/api/calculate`

Calculate retirement projection.

**Request Body:**
```json
{
  "currentAge": 30,
  "retirementAge": 60,
  "currentSavings": 500000,
  "monthlyContribution": 10000,
  "expectedAnnualReturnRate": 0.12,
  "currentMonthlyExpense": 30000,
  "annualInflationRate": 0.06,
  "postRetirementNominalReturnRate": 0.08
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output": {
      "retirementCorpus": 35000000,
      "retirementDurationYears": 28.5,
      "futureMonthlyExpense": 172000
    }
  }
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "sr-calculator",
  "timestamp": "2025-01-20T12:00:00.000Z"
}
```

---

## ☁️ AWS Deployment

### Using Terraform

```bash
cd terraform/environments/dev

# Initialize
terraform init

# Preview changes
terraform plan

# Deploy
terraform apply

# Get ALB URL
terraform output alb_dns_name

# Destroy (save costs)
terraform destroy
```

---

## 💰 Cost Optimization

| Component | Cost/Month |
|-----------|------------|
| NAT Gateway | ~$32 |
| RDS (db.t3.micro) | ~$15 |
| ECS Fargate | ~$15 |
| ALB | ~$18 |
| **Total** | **~$80/month** |

**Demo Mode:** Use `terraform destroy` when not demoing to reduce costs to ~$0.

---

## 🧪 Testing

```bash
# Run linter
bun run lint

# Type check
bunx tsc --noEmit
```

---

## 📄 License

MIT License

---

## 👤 Author

**Immanuel Santosh**
- GitHub: [@edwardjsi](https://github.com/edwardjsi)

---

## 🙏 Built For

DevOps portfolio demonstration - showcasing:
- Infrastructure as Code (Terraform)
- Containerization (Docker, ECS)
- Cloud Architecture (AWS)
- Full-stack TypeScript development
