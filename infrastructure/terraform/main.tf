terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

# IAM Policy for nolab team to create users in Cognito
resource "aws_iam_policy" "nolab_team_cognito_admin_create_user" {
  name        = "NoLabTeamCognitoAdminCreateUser"
  description = "Policy to allow nolab team to create users in Cognito User Pool"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminCreateUser"
        ]
        Resource = [
          "arn:aws:cognito-idp:us-east-2:410450514243:userpool/us-east-2_h3oulDqdO"
        ]
      }
    ]
  })

  tags = {
    Team        = "nolab"
    Environment = "production"
    Purpose     = "cognito-user-creation"
  }
}

# IAM Group for nolab team
resource "aws_iam_group" "nolab_team" {
  name = "nolab-team"
  path = "/"
}

# Attach the policy to the nolab team group
resource "aws_iam_group_policy_attachment" "nolab_team_cognito_policy" {
  group      = aws_iam_group.nolab_team.name
  policy_arn = aws_iam_policy.nolab_team_cognito_admin_create_user.arn
}

# Add the user joahan to the nolab team group
resource "aws_iam_user_group_membership" "joahan_nolab_team" {
  user = "joahan"
  groups = [
    aws_iam_group.nolab_team.name,
  ]
}

# Output the policy ARN for reference
output "nolab_team_cognito_policy_arn" {
  description = "ARN of the IAM policy for nolab team Cognito access"
  value       = aws_iam_policy.nolab_team_cognito_admin_create_user.arn
}

output "nolab_team_group_name" {
  description = "Name of the IAM group for nolab team"
  value       = aws_iam_group.nolab_team.name
}