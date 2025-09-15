## Frontend Testing PRD (Product Requirements Document)

### 1) Document purpose

Define the product requirements, quality goals, and acceptance criteria for frontend testing of the Polymind web application. This PRD aligns product intent with verifiable, testable outcomes.

### 2) Product overview

Polymind is a Next.js app with protected chat functionality using Supabase Auth and a chat API backed by OpenRouter models.

- **Framework**: Next.js App Router, TypeScript
- **Auth**: Supabase (email/password)
- **Core Features**:
  - User signup and login (`/signup`, `/login`) with guarded routes under `app/(protected)/`
  - Start/resume chat sessions under `/(protected)/chat/[sessionId]`
  - Message input with model selection, displays assistant responses
  - Chat history page `/(protected)/history` with navigation to prior sessions
- **APIs**: `app/api/chat/route.ts` (stream/generate responses)

### 3) Users and personas

- **New user**: Signs up, then lands in the protected area with no sessions yet
- **Returning user**: Logs in, opens history, resumes or creates new sessions
- **Power user**: Switches models, multi-session workflows, expects performance and reliability

### 4) Goals and non-goals

- **Goals**:
  - Verify authentication flows and protected routing
  - Ensure chat creation, message sending, streaming/response rendering
  - Validate chat history discoverability and session continuity
  - Validate model selection impacts request payloads and UI state
  - Enforce baseline accessibility and responsive behavior
  - Ensure failures are handled gracefully (network, auth, API)
- **Non-goals**:
  - Backend model quality evaluation
  - Load testing beyond set frontend performance budgets

### 5) In-scope features for testing

- Signup (`app/signup/page.tsx`)
- Login (`app/login/page.tsx`)
- Protected layout and middleware (`app/(protected)/layout.tsx`, `app/middleware.ts`, `utils/supabase/middleware.ts`)
- Chat page (`app/(protected)/chat/[sessionId]/page.tsx`) and components: `MessageInput`, `ModelSelector`, `ResponseColumn`
- History page (`app/(protected)/history/page.tsx`)
- API integration to `app/api/chat/route.ts` including streaming and error states

### 6) Out of scope

- Database migrations validation (handled by backend/integration tests)
- OpenRouter model correctness

### 7) Assumptions and constraints

- Supabase project and env vars configured as per `SUPABASE_SETUP.md`
- OpenRouter API key available for e2e in a staging profile; otherwise mocked in CI
- App Router, server actions, and middleware enforce auth redirects

### 8) Dependencies

- Supabase Auth and DB
- OpenRouter API
- Browser APIs: Fetch, EventSource/stream reading

### 9) Quality criteria and acceptance

- **Functional**:
  - Signup: valid form submits; invalid inputs show inline errors; success auto-authenticates or routes to login
  - Login: valid credentials route to protected area; invalid auth shows error; logged-in users can access protected pages
  - Protected routing: unauthenticated users are redirected from protected routes to login
  - Chat: sending a message appends user bubble; assistant response appears (streamed or mocked) without blocking UI
  - History: displays sessions for the logged-in user; clicking navigates to the correct session
  - Model selection: updates selection, persists for the current input, is sent to API
- **Accessibility**:
  - All interactive controls reachable via keyboard; visible focus states
  - Labels and ARIA attributes for inputs/buttons; landmarks used where applicable
  - Color contrast meets WCAG AA
- **Performance**:
  - First meaningful paint under 2.5s on mid-tier laptop conditions in CI (throttled)
  - Chat input interaction response under 100ms for local UI updates
  - Streaming chunk render cadence acceptable (no jank > 200ms frames)
- **Reliability**:
  - Network/API failures produce non-blocking error UI with retry affordance
  - Session state persists across navigation

### 10) Test strategy overview

- **Unit tests** for components and utilities
- **Integration tests** for auth flows, protected routing, and chat API adapter
- **E2E tests** for critical user journeys (signup → chat, login → history → chat)
- **A11y checks** using automated tooling (axe) and manual keyboard checks
- **Cross-browser smoke** in CI (Chromium) and manual spot-check (WebKit/Firefox) pre-release

### 11) Test data

- Credential pairs:
  - Valid: test user created via Supabase admin API or signup flow
  - Invalid: malformed email, short password, wrong password
- Chat seeds:
  - Empty new session
  - Session with a few back-and-forth messages
- API responses:
  - Success streaming
  - Error payloads (4xx/5xx)

### 12) Environments

- **Local dev**: live Supabase or local emulator; OpenRouter mocked by test server
- **CI**: fully mocked network for determinism; ephemeral Supabase test project if available
- **Staging**: real Supabase, real OpenRouter (limited smoke only)

### 13) Risks and mitigations

- Third-party outages → Mock in CI; retry with backoff
- Streaming flakiness → Fallback to non-streamed render in test shim; assert partials tolerated
- Auth race conditions on redirect → Add deterministic waits on session state and route changes

### 14) Monitoring and reporting

- CI artifacts: HTML test reports, screenshots, videos, a11y reports
- Key metrics reported each run: test duration, pass rate, flake rate, performance budgets

### 15) Release criteria (must-pass)

- 100% pass on critical E2E flows
- No severity-1 a11y violations
- Performance budgets not exceeded
- No open P0 defects

### 16) Acceptance test checklist

- Signup happy path and error validations
- Login happy path and error validations
- Redirects from protected routes when unauthenticated
- New chat creation and sending first message
- Receiving and rendering streamed assistant response (or mocked equivalent)
- History listing and navigation to existing session
- Model selection updates request payload
- A11y keyboard navigation across main flows
- Responsive layout at common breakpoints

---

## Detailed Frontend Test Plan

### Scope

Covers unit, integration, and E2E tests for the Polymind Next.js frontend: auth, protected routing, chat session UX, history navigation, model selection, API/stream handling, a11y, and responsiveness.

### Test Types

- Unit: components (`MessageInput`, `ModelSelector`, `ResponseColumn`), utils
- Integration: auth flows, protected routing, chat API adapter
- E2E: signup → chat; login → history → chat; model switch; error handling
- A11y: automated axe + manual keyboard checks
- Cross-browser smoke: Chromium in CI; manual WebKit/Firefox before release

### Tooling

- Test runner: Playwright (E2E) and/or Cypress (alternative)
- Component tests: React Testing Library + Jest/Vitest
- A11y: axe-core or @axe-core/playwright
- Coverage reporting: Istanbul

### Environments

- Local: real Supabase, mock OpenRouter for determinism
- CI: mocked network; optional ephemeral Supabase test project
- Staging: limited smoke with real services

### Critical User Journeys (E2E)

1. Signup happy path

   - Navigate `/signup`
   - Fill valid email/password; submit
   - Expect success UI and redirect or login flow; access protected route

2. Login and protected access

   - Navigate `/login`
   - Submit valid credentials; expect redirect to `/(protected)`
   - Directly hit `/(protected)/chat/[sessionId]` when authenticated; no redirect to login

3. Guarded routes (unauthenticated)

   - Visit `/(protected)/history` when logged out; expect redirect to `/login`

4. Create new chat and send message

   - From protected area, open a new session
   - Type a prompt; submit via `MessageInput` button/Enter
   - See user message; then see streamed assistant response (mocked in CI)

5. Resume existing session from history

   - Visit `/(protected)/history`; confirm list includes prior session
   - Click a session; routed to `/(protected)/chat/[sessionId]`; messages render

6. Model selection behavior

   - Open `ModelSelector`; choose another model
   - Next send uses chosen model; request payload reflects selection

7. Error handling
   - Mock 401 on protected API; show error UI and route to login if session expired
   - Mock 5xx or network failure on chat; show retry affordance and keep input state

### Component Tests

- MessageInput

  - Renders textarea, submit button disabled when empty
  - Calls onSend with trimmed text; clears field on success
  - Keyboard Enter submits; Shift+Enter inserts newline

- ModelSelector

  - Lists available models from `lib/ai-models.ts`
  - Selecting updates internal state and calls `onChange`

- ResponseColumn
  - Renders existing messages in order; streams updates appended
  - Handles partial chunks without layout shift

### Integration Tests

- AuthContext + middleware

  - With mock session, protected pages render
  - Without session, redirect performed

- Chat API adapter
  - Sends request with selected model and messages
  - Parses streaming chunks and updates UI progressively

### A11y Tests

- All forms have labels and descriptive errors
- Focus management after navigation and modals
- Keyboard-only: tab order, visible focus rings, actionable controls reachable
- Color contrast at WCAG AA

### Responsiveness

- Breakpoints: 320, 375, 768, 1024, 1440
- Chat layout adapts without horizontal scroll; input and history usable

### Test Data

- Users: valid test user, invalid credentials
- Sessions: empty new, seeded prior
- API: success stream, auth error, server error, network fail

### Performance Budgets (UI)

- FMP < 2.5s on CI profile
- Input-to-render < 100ms for local echo
- No long tasks > 200ms during stream

### Reporting and Artifacts

- Videos, screenshots, traces for failures
- A11y report JSON/HTML
- Coverage thresholds: 70% components, 50% overall to start

### Exit Criteria

- All critical journeys pass
- No severity-1 a11y issues
- Budgets met; no P0 bugs open
