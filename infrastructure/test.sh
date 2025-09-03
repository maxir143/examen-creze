#!/bin/bash

# Test script to verify the IAM policy would resolve the Cognito permission issue

set -e

SCRIPT_DIR="$(dirname "$0")"
POLICY_FILE="$SCRIPT_DIR/iam-policies/nolab-team-cognito-policy.json"

echo "🧪 Testing IAM policy for Cognito permissions..."

# Test 1: Validate JSON syntax
echo "1️⃣ Validating JSON syntax..."
if python3 -m json.tool "$POLICY_FILE" > /dev/null; then
    echo "   ✅ JSON syntax is valid"
else
    echo "   ❌ JSON syntax is invalid"
    exit 1
fi

# Test 2: Check required elements
echo "2️⃣ Checking policy structure..."

# Check Version
if grep -q '"Version": "2012-10-17"' "$POLICY_FILE"; then
    echo "   ✅ Policy version is correct"
else
    echo "   ❌ Policy version is missing or incorrect"
    exit 1
fi

# Check Action
if grep -q '"cognito-idp:AdminCreateUser"' "$POLICY_FILE"; then
    echo "   ✅ Required action is present"
else
    echo "   ❌ Required action is missing"
    exit 1
fi

# Check Resource ARN
if grep -q 'arn:aws:cognito-idp:us-east-2:410450514243:userpool/us-east-2_h3oulDqdO' "$POLICY_FILE"; then
    echo "   ✅ Correct Cognito User Pool ARN is specified"
else
    echo "   ❌ Cognito User Pool ARN is missing or incorrect"
    exit 1
fi

# Check Effect
if grep -q '"Effect": "Allow"' "$POLICY_FILE"; then
    echo "   ✅ Policy allows the action"
else
    echo "   ❌ Policy does not allow the action"
    exit 1
fi

echo ""
echo "3️⃣ Testing Terraform configuration..."
cd "$SCRIPT_DIR/terraform"

# Initialize and validate Terraform
terraform init -backend=false > /dev/null 2>&1
if terraform validate > /dev/null 2>&1; then
    echo "   ✅ Terraform configuration is valid"
else
    echo "   ❌ Terraform configuration is invalid"
    exit 1
fi

echo ""
echo "4️⃣ Policy Analysis:"
echo "   - Action Granted: cognito-idp:AdminCreateUser"
echo "   - Resource Scope: us-east-2_h3oulDqdO User Pool"
echo "   - Effect: Allow"
echo "   - Principal: nolab-team group (includes user 'joahan')"
echo ""
echo "✅ All tests passed! This policy should resolve the AccessDeniedException."
echo ""
echo "📋 To deploy:"
echo "   Option 1: ./infrastructure/deploy.sh"
echo "   Option 2: cd infrastructure/terraform && terraform apply"
echo "   Option 3: aws cloudformation create-stack (see README.md)"