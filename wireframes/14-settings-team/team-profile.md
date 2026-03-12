# Team Profile

## Route: `/settings/teams/:teamId/profile`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Profile                             |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Team Avatar                                |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  +--------+                                |
|   Password  |  |        |  Upload a team photo or logo.  |
|   Two-Factor|  |  [AV]  |  Recommended: 256x256px.       |
|   SSO       |  |        |                                |
|   Compliance|  +--------+                                |
|   Imperson. |                                            |
|             |  [Upload Image]  [Remove]                   |
| > Developer |                                            |
|   API Keys  |  ========================================  |
|   OAuth     |                                            |
|   Webhooks  |  Team Bio                                   |
|             |  ----------------------------------------  |
| > Team      |                                            |
|   Settings  |  +--------------------------------------+  |
|  [Profile]  |  | Acme Engineering is a world-class     |  |
|   Appearance|  | team of developers building the       |  |
|   Members   |  | future of scheduling. We believe in   |  |
|   Roles     |  | open source and great UX.             |  |
|   Features  |  |                                      |  |
|   Billing   |  |                                      |  |
|             |  +--------------------------------------+  |
|             |  0/500 characters                          |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Social Links                               |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Website                                    |
|             |  +--------------------------------------+  |
|             |  | https://acme-engineering.com          |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Twitter / X                                |
|             |  +--------------------------------------+  |
|             |  | https://x.com/acme_eng               |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  LinkedIn                                   |
|             |  +--------------------------------------+  |
|             |  | https://linkedin.com/company/acme    |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  GitHub                                     |
|             |  +--------------------------------------+  |
|             |  | https://github.com/acme-eng          |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  YouTube                                    |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Preview                                    |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |  +----+                              |  |
|             |  |  |AV  | Acme Engineering             |  |
|             |  |  +----+ We build amazing scheduling  |  |
|             |  |         software...                  |  |
|             |  |                                      |  |
|             |  |  [W] [X] [Li] [GH]                   |  |
|             |  |  (social icon links)                 |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Profile     |                      |
|             |  +------------------+                      |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Avatar | `<Avatar>` + `<FileUpload>` | Image upload with preview |
| Upload Image | `<Button>` | Opens file picker |
| Remove | `<Button>` | Removes current avatar |
| Bio | `<Textarea>` | Max 500 chars, rich text optional |
| Website | `<Input>` | URL validation |
| Twitter | `<Input>` | URL or @handle |
| LinkedIn | `<Input>` | URL validation |
| GitHub | `<Input>` | URL validation |
| YouTube | `<Input>` | URL validation |
| Preview Card | `<Card>` | Live preview of team profile |
| Save Profile | `<Button>` | Primary |

## States

- **Default**: Current profile data populated
- **Uploading**: Image upload progress indicator
- **Preview**: Live preview updates as fields change
- **Saving**: Button loading spinner
- **Error**: URL validation inline errors
