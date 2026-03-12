# Getting Started Wizard

**Route:** `/getting-started`
**Type:** Authenticated
**Parent Layout:** Onboarding Layout (minimal chrome, centered content)

## Description
Multi-step onboarding wizard that guides new users through initial setup. Displays a step indicator at the top, the current step's content in the center, and navigation buttons at the bottom. Steps include profile setup, calendar connection, availability, and personal settings.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ┌──────────┐                             │
│                        │ Cal.com  │                             │
│                        └──────────┘                             │
│                                                                 │
│   ┌─────────────── Step Indicator ────────────────────────┐     │
│   │                                                       │     │
│   │    (1)───────(2)───────(3)───────(4)───────(5)        │     │
│   │   Profile  Calendar  Avail.   Settings  Complete      │     │
│   │    [●]       [○]      [○]       [○]       [○]         │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │              Step Title Goes Here                     │     │
│   │              ─────────────────────                    │     │
│   │                                                       │     │
│   │    Step description text explaining what this         │     │
│   │    step is about and why it matters.                  │     │
│   │                                                       │     │
│   │   ┌───────────────────────────────────────────┐       │     │
│   │   │                                           │       │     │
│   │   │                                           │       │     │
│   │   │        [ Current Step Content ]           │       │     │
│   │   │        ( Loaded dynamically per step )    │       │     │
│   │   │                                           │       │     │
│   │   │                                           │       │     │
│   │   │                                           │       │     │
│   │   └───────────────────────────────────────────┘       │     │
│   │                                                       │     │
│   │                                                       │     │
│   │   ┌──────────────┐              ┌────────────────┐    │     │
│   │   │   ← Back     │              │   Next →       │    │     │
│   │   │  (secondary)  │              │  (primary)     │    │     │
│   │   └──────────────┘              └────────────────┘    │     │
│   │                                                       │     │
│   │                    Skip for now                       │     │
│   │                    ─────────────                      │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
│              Step 1 of 5  ·  About 3 min left                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `StepIndicator` - Horizontal progress dots with labels, highlights current step
- `OnboardingCard` - Centered card container for step content
- `Button` (primary) - "Next" / "Continue" / "Finish" depending on step
- `Button` (secondary) - "Back" button (hidden on first step)
- `Link` - "Skip for now" text link
- `ProgressText` - "Step X of Y" with estimated time remaining

## User Actions
- Click "Next" to advance to the next step (validates current step first)
- Click "Back" to return to the previous step (preserves entered data)
- Click "Skip for now" to skip the current optional step
- Click a completed step indicator dot to jump back to that step
- Press Enter to submit current step and advance

## Navigation
- **Next**: Advances to the next onboarding step
- **Back**: Returns to the previous step
- **Skip**: Moves to next step without completing current one
- **Step dots**: Jump to any previously completed step
- **Final step "Finish"**: Redirects to `/event-types` (dashboard)

## States
- **Loading**: Skeleton placeholders for step content while data loads
- **Step Active**: Current step highlighted in indicator, content visible
- **Step Completed**: Checkmark on completed steps, clickable to revisit
- **Step Upcoming**: Grayed-out dots for future steps
- **Validation Error**: Inline errors on current step fields, Next button disabled
- **Saving**: Next button shows spinner while saving step data
- **Skip Confirmation**: Some steps show confirmation before skipping
