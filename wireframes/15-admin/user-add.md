# Add User

## Overview
Form to create a new user and optionally send an invite email.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  [< Back to Users]                                     |
| MENU    |                                                         |
|         |  Add New User                                           |
|         |  Create a new user account.                             |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Full Name *                                       | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Enter full name                              |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Email Address *                                   | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Enter email address                          |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Username                                          | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Enter username (optional)                    |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |  cal.com/username                                  | |
|         |  |                                                    | |
|         |  |  Role *                                            | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Member                                    [v]|  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  +----------------------------------------------+  | |
|         |  |  |  [x] Send invite email                       |  | |
|         |  |  |                                              |  | |
|         |  |  |  The user will receive an email with a       |  | |
|         |  |  |  link to set their password and complete     |  | |
|         |  |  |  their account setup.                        |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |              [Cancel]  [Create User]               | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
+------------------------------------------------------------------+

Role dropdown options:
+------------------+
| Member           |
| Admin            |
+------------------+
```

## Form Fields

| Field            | Type     | Required | Notes                        |
|------------------|----------|----------|------------------------------|
| Full Name        | Text     | Yes      | Min 2 characters             |
| Email Address    | Email    | Yes      | Must be unique               |
| Username         | Text     | No       | Auto-generated from name     |
| Role             | Select   | Yes      | Default: Member              |
| Send invite      | Toggle   | No       | Default: checked             |

## Validation

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format, must not exist in system
- **Username**: Optional, alphanumeric and hyphens, must be unique

## Actions

- **Create User**: Validates and creates account, redirects to users list
- **Cancel**: Returns to users list without changes

## States
- **Default**: Empty form with defaults
- **Validating**: Field-level validation on blur
- **Error**: Inline error messages below fields
- **Submitting**: Button shows spinner, fields disabled
- **Duplicate email**: Error "A user with this email already exists"
