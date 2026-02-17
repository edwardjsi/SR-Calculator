# SR Calculator - Terraform Infrastructure

This directory contains Terraform configuration for deploying SR Calculator to AWS.

## 📁 Structure

```
terraform/
├── modules/
│   ├── vpc/          # VPC, Subnets, NAT Gateway
│   ├── alb/          # Application Load Balancer
│   ├── ecs/          # ECS Fargate, ECR
│   └── iam/          # IAM Roles
└── environments/
    └── dev/          # Development environment
```

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured (`aws configure`)
- Terraform 1.9+ installed
- Docker installed

### Deploy

```bash
cd terraform/environments/dev

# Initialize
terraform init

# Preview changes
terraform plan

# Deploy infrastructure
terraform apply

# Get outputs
terraform output
```

### Push Docker Image

```bash
# Get ECR URL
ECR_URL=$(terraform output -raw ecr_repository_url)

# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin $ECR_URL

# Build and push
docker build -t sr-calculator .
docker tag sr-calculator:latest $ECR_URL:latest
docker push $ECR_URL:latest

# Force deployment
aws ecs update-service \
  --cluster sr-calculator-dev \
  --service sr-calculator-dev-service \
  --force-new-deployment \
  --region ap-south-1
```

### Access Application

```bash
# Get URL
terraform output app_url
```

### Destroy (Save Costs)

```bash
terraform destroy
```

## 💰 Estimated Costs

| Component | Cost/Month |
|-----------|------------|
| NAT Gateway | ~$32 |
| ALB | ~$18 |
| ECS Fargate (1 task) | ~$15 |
| **Total** | **~$65/month** |

**Demo Mode:** Use `terraform destroy` when not demoing to reduce costs to $0.

## 🔧 Configuration

Edit `terraform/environments/dev/variables.tf` to customize:
- AWS Region
- Instance sizes
- Number of tasks
