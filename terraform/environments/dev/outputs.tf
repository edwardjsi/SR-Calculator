# SR Calculator - Development Environment Outputs

# ============================================================
# VPC Outputs
# ============================================================
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

# ============================================================
# ALB Outputs
# ============================================================
output "alb_dns_name" {
  description = "DNS name of the load balancer (use this to access the app)"
  value       = module.alb.alb_dns_name
}

output "app_url" {
  description = "URL to access the application"
  value       = "http://${module.alb.alb_dns_name}"
}

# ============================================================
# ECS Outputs
# ============================================================
output "ecr_repository_url" {
  description = "URL of the ECR repository (push Docker image here)"
  value       = module.ecs.ecr_repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.ecs_service_name
}

# ============================================================
# RDS Outputs
# ============================================================
output "db_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
}

output "db_name" {
  description = "Database name"
  value       = module.rds.db_name
}

output "db_credentials_secret_arn" {
  description = "ARN of Secrets Manager secret with DB credentials"
  value       = module.rds.db_credentials_secret_arn
}

# ============================================================
# Quick Reference
# ============================================================
output "deployment_instructions" {
  description = "Instructions for deploying the application"
  value       = <<-EOT
    
    =====================================================
    SR Calculator - Deployment Instructions
    =====================================================
    
    1. Get Database Credentials:
       aws secretsmanager get-secret-value \
         --secret-id ${module.rds.db_credentials_secret_arn} \
         --region ap-south-1 \
         --query SecretString --output text
    
    2. Build and push Docker image:
       aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${module.ecs.ecr_repository_url}
       docker build -t sr-calculator .
       docker tag sr-calculator:latest ${module.ecs.ecr_repository_url}:latest
       docker push ${module.ecs.ecr_repository_url}:latest
    
    3. Force new deployment:
       aws ecs update-service --cluster ${module.ecs.ecs_cluster_name} --service ${module.ecs.ecs_service_name} --force-new-deployment --region ap-south-1
    
    4. Access the application:
       http://${module.alb.alb_dns_name}
    
    5. Destroy infrastructure (save costs):
       terraform destroy
    
    =====================================================
  EOT
}
