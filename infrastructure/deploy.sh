#!/bin/bash

# Script to deploy nolab team Cognito permissions using AWS CLI

set -e

SCRIPT_DIR="$(dirname "$0")"
POLICY_FILE="$SCRIPT_DIR/iam-policies/nolab-team-cognito-policy.json"
POLICY_NAME="NoLabTeamCognitoAdminCreateUser"
GROUP_NAME="nolab-team"
USER_NAME="joahan"
AWS_ACCOUNT_ID="410450514243"

echo "🚀 Deploying nolab team Cognito permissions..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS CLI is not configured or credentials are invalid"
    exit 1
fi

# Create the IAM policy
echo "📋 Creating IAM policy: $POLICY_NAME"
POLICY_ARN=$(aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document "file://$POLICY_FILE" \
    --query 'Policy.Arn' \
    --output text 2>/dev/null || echo "")

if [ -z "$POLICY_ARN" ]; then
    echo "⚠️  Policy may already exist, getting existing ARN..."
    POLICY_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:policy/$POLICY_NAME"
else
    echo "✅ Created policy: $POLICY_ARN"
fi

# Create the IAM group
echo "👥 Creating IAM group: $GROUP_NAME"
aws iam create-group --group-name "$GROUP_NAME" 2>/dev/null || echo "⚠️  Group may already exist"

# Attach policy to group
echo "🔗 Attaching policy to group..."
aws iam attach-group-policy \
    --group-name "$GROUP_NAME" \
    --policy-arn "$POLICY_ARN"

# Add user to group
echo "👤 Adding user $USER_NAME to group $GROUP_NAME..."
aws iam add-user-to-group \
    --group-name "$GROUP_NAME" \
    --user-name "$USER_NAME"

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Summary:"
echo "  - Policy ARN: $POLICY_ARN"
echo "  - Group Name: $GROUP_NAME"
echo "  - User: $USER_NAME"
echo ""
echo "🔍 Verification commands:"
echo "  aws iam get-groups-for-user --user-name $USER_NAME"
echo "  aws iam list-attached-group-policies --group-name $GROUP_NAME"