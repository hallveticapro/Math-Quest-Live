# MathQuest Live Future Improvements

This backlog captures useful ideas that should wait until the MVP is stable. These are not current requirements, and they should not introduce accounts, rosters, saved progress, analytics, or a database without a separate privacy and security design.

## Teacher / Debug Benchmark Display

- Purpose: Let teachers optionally inspect Florida B.E.S.T. benchmark metadata for the current or completed quest.
- Why later: Benchmark wording should be verified against CPALMS before public-facing display.
- Likely files/areas: `math/floridaBestMath.ts`, `mathEngine.ts`, `GameScreen.tsx`, `EndingScreen.tsx`, possible settings dialog.
- Privacy/safety notes: Keep benchmark display local/session-only. Do not store performance data.
- Implementation risks: Overclaiming standards alignment or cluttering student UI.

## Sound On/Off Setting

- Purpose: Let classrooms mute UI sounds without changing browser/device settings.
- Why later: Current sounds are session-only polish and not required for core learning flow.
- Likely files/areas: `lib/sounds.ts`, `QuestSettingsDialog.tsx`, `App.tsx`.
- Privacy/safety notes: Session-only setting; no localStorage for MVP unless intentionally approved later.
- Implementation risks: Adding preference persistence too early.

## More Fallback Scene And Ending Variants

- Purpose: Make AI failure paths feel less repetitive and more game-like.
- Why later: Existing fallback content is safe and functional.
- Likely files/areas: `api-server/src/routes/game/gameRoutes.ts`, possibly a fallback content module.
- Privacy/safety notes: Keep all fallback text prewritten and classroom-safe.
- Implementation risks: More content to review for safety.

## More Reward Moments

- Purpose: Add lightweight celebration after key progress moments or quest completion.
- Why later: Core math/story flow should remain stable first.
- Likely files/areas: `GameScreen.tsx`, `EndingScreen.tsx`, `lib/sounds.ts`, CSS.
- Privacy/safety notes: Rewards should not store progress or compare students.
- Implementation risks: Too much animation/audio can distract in classrooms.

## Teacher Launch Presets

- Purpose: Let a teacher quickly choose a challenge band, quest length, theme, and maybe skill focus for centers or whole-class play.
- Why later: Needs careful UX to avoid becoming a dashboard.
- Likely files/areas: `TitleScreen.tsx`, `SetupScreen.tsx`, `quickStart.ts`, future settings/config.
- Privacy/safety notes: No rosters, names, accounts, or saved settings in MVP.
- Implementation risks: Scope creep into classroom-management tooling.

## Skill-Focus Quest Packs

- Purpose: Let a session focus on fractions, decimals, geometry, or operations while staying inside the selected standards band.
- Why later: Generator coverage should be broader first.
- Likely files/areas: `floridaBestMath.ts`, `mathEngine.ts`, setup/settings UI, validation scripts.
- Privacy/safety notes: Session-only selection; no assessment records.
- Implementation risks: Narrow pools can increase repeated-question risk.

## Server-Side Math Sessions If Assessment Use Emerges

- Purpose: Move session state server-side only if the app becomes assessment-like.
- Why later: Current MVP is practice/play and intentionally avoids server-side student tracking.
- Likely files/areas: backend game routes, frontend API flow, deployment config.
- Privacy/safety notes: Would require privacy design, retention policy, and likely authentication.
- Implementation risks: Adds operational complexity and student-data responsibilities.

## Teacher Dashboards, Rosters, Or Saved Progress

- Purpose: Support formal classroom management, progress tracking, or reports.
- Why later: This is outside the MVP and creates major privacy/security obligations.
- Likely files/areas: new auth, database, backend APIs, admin UI, deployment secrets.
- Privacy/safety notes: Requires COPPA/FERPA-aware design, consent/retention decisions, authentication, authorization, and data-minimization review.
- Implementation risks: High scope, high compliance burden, and high maintenance cost.
