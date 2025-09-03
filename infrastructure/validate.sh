#!/bin/bash

# Script to validate Terraform configuration for nolab team Cognito permissions

set -e

echo "🔍 Validating Terraform configuration..."

cd "$(dirname "$0")/terraform"

# Initialize Terraform
echo "📦 Initializing Terraform..."
terraform init -backend=false

# Validate configuration
echo "✅ Validating Terraform syntax..."
terraform validate

# Format check
echo "🎨 Checking Terraform formatting..."
terraform fmt -check

# Plan (dry-run)
echo "📋 Running Terraform plan (dry-run)..."
terraform plan -input=false

echo "✅ All validations passed successfully!"
echo ""
echo "To apply the configuration:"
echo "  cd infrastructure/terraform"
echo "  terraform init"
echo "  terraform plan"
echo "  terraform apply"