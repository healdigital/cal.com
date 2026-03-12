# Routing Forms

## Route: `/apps/routing-forms/forms`

## Description
List and editor for routing forms. Routing forms allow users to create question-based forms that route respondents to different event types, links, or custom URLs based on their answers.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Routing Forms                    [+ New Routing Form]  |
|          |                                                       |
| Event    | Route your bookers to the right place based on        |
| Types    | their answers.                                        |
| Bookings |                                                       |
| Avail.   | +----------------------------------------------------+|
| Teams    | | [x] Search forms...                                 ||
| Apps   * | +----------------------------------------------------+|
| Workflows|                                                       |
| Settings | +----------------------------------------------------+|
|          | |  Sales Inquiry Router                               ||
|          | |  3 questions  |  5 routes  |  Active               ||
|          | |                                                    ||
|          | |  Responses: 147 this month                          ||
|          | |  Last response: 2 hours ago                         ||
|          | |                                                    ||
|          | |  [Share Link]  [Edit]  [Duplicate]  [...More]       ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |  Support Triage                                     ||
|          | |  4 questions  |  3 routes  |  Active               ||
|          | |                                                    ||
|          | |  Responses: 89 this month                           ||
|          | |  Last response: 30 minutes ago                      ||
|          | |                                                    ||
|          | |  [Share Link]  [Edit]  [Duplicate]  [...More]       ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |  Onboarding Scheduler                               ||
|          | |  2 questions  |  2 routes  |  Inactive (Draft)     ||
|          | |                                                    ||
|          | |  Responses: 0                                       ||
|          | |                                                    ||
|          | |  [Share Link]  [Edit]  [Duplicate]  [...More]       ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |                                                       |
|          | == FORM EDITOR (when Edit clicked) =================== |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | | Edit: Sales Inquiry Router                          ||
|          | |                                                    ||
|          | | Form Name:                                          ||
|          | | +------------------------------------------------+ ||
|          | | | Sales Inquiry Router                            | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | Description (shown to respondents):                 ||
|          | | +------------------------------------------------+ ||
|          | | | Help us route you to the right team member.     | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | -- Questions ------------------------------------  ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Q1: What type of inquiry is this?               | ||
|          | | | Type: [Single Select \/]                        | ||
|          | | | Options:                                        | ||
|          | | |   - New Business                                | ||
|          | | |   - Existing Customer                           | ||
|          | | |   - Partnership                                 | ||
|          | | | Required: [x]                                   | ||
|          | | | [Edit] [Delete]                         [Drag]  | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Q2: What is your company size?                   | ||
|          | | | Type: [Single Select \/]                        | ||
|          | | | Options:                                        | ||
|          | | |   - 1-10 employees                              | ||
|          | | |   - 11-50 employees                             | ||
|          | | |   - 51-200 employees                            | ||
|          | | |   - 200+ employees                              | ||
|          | | | Required: [x]                                   | ||
|          | | | [Edit] [Delete]                         [Drag]  | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Q3: How can we help you?                         | ||
|          | | | Type: [Long Text \/]                            | ||
|          | | | Required: [ ]                                   | ||
|          | | | [Edit] [Delete]                         [Drag]  | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | [+ Add Question]                                    ||
|          | |                                                    ||
|          | | -- Routing Rules ---------------------------------- ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Rule 1:                                         | ||
|          | | | IF [Q1 \/] [equals \/] [New Business \/]        | ||
|          | | | AND [Q2 \/] [equals \/] [200+ employees \/]     | ||
|          | | | THEN Route to:                                  | ||
|          | | | [Event Type \/] -> [Enterprise Sales Call \/]   | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Rule 2:                                         | ||
|          | | | IF [Q1 \/] [equals \/] [New Business \/]        | ||
|          | | | THEN Route to:                                  | ||
|          | | | [Event Type \/] -> [Sales Discovery Call \/]    | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Rule 3:                                         | ||
|          | | | IF [Q1 \/] [equals \/] [Existing Customer \/]   | ||
|          | | | THEN Route to:                                  | ||
|          | | | [Event Type \/] -> [Customer Success Call \/]   | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | +------------------------------------------------+ ||
|          | | | Fallback (no rules match):                      | ||
|          | | | Route to: [External URL \/]                     | ||
|          | | | URL: [https://cal.com/team/general________]     | ||
|          | | +------------------------------------------------+ ||
|          | |                                                    ||
|          | | [+ Add Rule]                                        ||
|          | |                                                    ||
|          | |              [Cancel]  [Save Form]                  ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

### Form List
- **Header**: Title, description, "New Routing Form" button
- **Search Bar**: Filter forms by name
- **Form Card**: Name, question/route counts, active status, response stats, action buttons

### Form Editor
- **Form Metadata**: Name and description fields
- **Questions Section**: Draggable list of questions
  - Question text, type selector, options (for select types), required toggle
  - Supported types: Single Select, Multi Select, Short Text, Long Text, Number, Phone, Email
- **Routing Rules**: Conditional logic builder
  - IF/AND condition rows with question, operator, value dropdowns
  - THEN route-to selector (Event Type, Custom URL, External URL)
  - Fallback route for unmatched respondents
- **Actions**: Cancel, Save Form buttons

## Question Types

| Type          | Description                          |
|---------------|--------------------------------------|
| Single Select | Radio buttons, one choice            |
| Multi Select  | Checkboxes, multiple choices         |
| Short Text    | Single-line text input               |
| Long Text     | Multi-line textarea                  |
| Number        | Numeric input                        |
| Phone         | Phone number with country code       |
| Email         | Email address input                  |

## Route Destinations

| Type           | Description                          |
|----------------|--------------------------------------|
| Event Type     | Routes to a specific Cal.com event   |
| Custom Page    | Routes to a Cal.com booking page     |
| External URL   | Redirects to any external URL        |

## States

- **Form List**: Default list view
- **Empty**: No forms created, show onboarding prompt
- **Editor**: Editing a form (inline or separate view)
- **Saving**: Loading state while saving form
- **Share Dialog**: Modal with form share link and embed options

## Interactions

- Click "New Routing Form" -> creates form and opens editor
- Click "Edit" -> opens form editor
- Click "Share Link" -> copies share link or opens share dialog
- Click "Duplicate" -> creates copy of form
- Click "...More" -> dropdown with Delete, View Responses, Toggle Active
- Drag question -> reorders questions
- Click "+ Add Question" -> adds new blank question
- Click "+ Add Rule" -> adds new routing rule
- Change rule conditions -> updates routing logic
