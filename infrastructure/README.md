# AWS IAM Permissions for nolab Team Cognito Access

This directory contains the necessary infrastructure as code to grant the `nolab` team permission to perform `cognito-idp:AdminCreateUser` operations on the specified Cognito User Pool.

## Problem Statement

The following error was encountered:
```
AccessDeniedException: User: arn:aws:iam::410450514243:user/joahan is not authorized to perform: cognito-idp:AdminCreateUser on resource: arn:aws:cognito-idp:us-east-2:410450514243:userpool/us-east-2_h3oulDqdO with an explicit deny in an identity-based policy
```

## Solution

This infrastructure creates:
1. An IAM policy that grants `cognito-idp:AdminCreateUser` permission on the specific User Pool
2. An IAM group called `nolab-team` 
3. Attaches the policy to the group
4. Adds the user `joahan` to the group

## Deployment Options

### Option 1: Terraform

#### Prerequisites
- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- Permissions to create IAM policies, groups, and manage user group memberships

#### Deployment Steps
```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

#### Cleanup
```bash
terraform destroy
```

### Option 2: CloudFormation

#### Prerequisites
- AWS CLI configured with appropriate credentials
- Permissions to create IAM policies, groups, and manage user group memberships

#### Deployment Steps
```bash
cd infrastructure/cloudformation
aws cloudformation create-stack \
  --stack-name nolab-team-cognito-permissions \
  --template-body file://nolab-team-cognito-permissions.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```

#### Check Status
```bash
aws cloudformation describe-stacks --stack-name nolab-team-cognito-permissions
```

#### Cleanup
```bash
aws cloudformation delete-stack --stack-name nolab-team-cognito-permissions
```

### Option 3: Manual AWS CLI Commands

#### Create the Policy
```bash
aws iam create-policy \
  --policy-name NoLabTeamCognitoAdminCreateUser \
  --policy-document file://iam-policies/nolab-team-cognito-policy.json
```

#### Create the Group
```bash
aws iam create-group --group-name nolab-team
```

#### Attach Policy to Group
```bash
aws iam attach-group-policy \
  --group-name nolab-team \
  --policy-arn arn:aws:iam::410450514243:policy/NoLabTeamCognitoAdminCreateUser
```

#### Add User to Group
```bash
aws iam add-user-to-group \
  --group-name nolab-team \
  --user-name joahan
```

## Files Included

- `iam-policies/nolab-team-cognito-policy.json` - Raw IAM policy document
- `terraform/main.tf` - Terraform configuration
- `cloudformation/nolab-team-cognito-permissions.yaml` - CloudFormation template

## Security Considerations

- The policy is scoped to the specific Cognito User Pool ARN
- Only the `AdminCreateUser` action is granted (principle of least privilege)
- Resources are tagged for proper tracking and management

## Testing

After deployment, the user `joahan` should be able to perform `cognito-idp:AdminCreateUser` operations on the specified User Pool without encountering the `AccessDeniedException`.

## Troubleshooting

1. **Permission still denied**: Ensure there are no explicit deny policies at the user, group, or role level
2. **User not in group**: Verify the user was successfully added to the group using `aws iam get-groups-for-user --user-name joahan`
3. **Policy not attached**: Check that the policy is attached to the group using `aws iam list-attached-group-policies --group-name nolab-team`