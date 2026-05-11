# MathQuest Live Next Major Implementation Plan

## Goal

Complete this entire plan end-to-end in one working pass.

Before editing, inspect the current implementation across the frontend, backend, tests, reference files, and README, then explain the implementation plan you intend to follow. After that, continue working through every section below without stopping to ask for feedback. Make reasonable assumptions when needed and keep moving.

Do not rewrite the whole app.

---

# Global Product Rules

MathQuest Live must remain a classroom-safe, user-facing math adventure game for upper elementary students.

## Non-negotiable constraints

- No student accounts.
- No database.
- No analytics.
- No ads.
- No saved student data.
- No persistent progress.
- No freeform student story input.
- All student story actions must remain button/card based.
- Math must remain generated and checked by deterministic app code, not AI.
- AI may write story scenes and choices only.
- OpenAI API keys must stay backend-only.
- Do not expose secrets to the frontend.
- Keep all settings session-only unless explicitly required otherwise.
- Keep MVP simple.
- Do not add teacher-facing UI, teacher-only notes, teacher dashboards, classroom mode, teacher presets, teacher-only skill displays, printable teacher summaries, or any feature meant only for teachers.
- All new product-facing work should be user-facing. Developer documentation is fine where needed.
- Do not add dependency-audit remediation in this pass.
- Do not add a high-readability mode or simple-text mode in this pass.

## Existing standards model that must remain intact

Internal difficulty keys may remain:

- `easy`
- `medium`
- `hard`
- `extreme`

Student-facing labels must be:

- Adventurer = Grade 3 Florida B.E.S.T.
- Hero = Grade 4 Florida B.E.S.T.
- Champion = Grade 5 Florida B.E.S.T.
- Legend = advanced Grade 5 Florida B.E.S.T., still within Grade 5 limits

Do not add a separate student-facing grade selector.

Extreme / Legend must not drift into Grade 6 or middle school standards.

## Existing safety model that must remain intact

AI story output must remain classroom-safe for ages 8-11.

Do not allow:

- gore
- death
- romance
- profanity
- horror
- drugs, alcohol, or vaping
- sexual content
- real-world politics
- real-world religion
- bullying
- stereotypes
- personal information requests

Allowed danger should remain cartoon adventure danger only.

Problems should be solved through math, observation, courage, creativity, kindness, teamwork, and patience.

---

# Section 1: Replace Start Locations With Genre-Based Quest Selection

## Goal

Remove the current user-facing choice of where the story begins and replace it with a genre-based selection system. The chosen genre must shape the entire quest, not just the opening scene.

## Required behavior

### Genre selection

Replace the old start-location / adventure-start selection with a genre selection step.

The first option shown must be:

- **Surprise Me!**

Then provide a curated set of classroom-safe genres. At minimum, include genres equivalent to:

- Fantasy
- Space Adventure
- Mystery
- Pirate Adventure
- Jungle Adventure
- Underwater Adventure
- Sky Islands
- Clockwork / Invention
- Ancient Ruins
- Spooky Mystery / Friendly Ghosts

You may add additional safe genres if they fit the product and do not clutter the setup flow.

### Friendly spooky requirement

Any ghost or spooky genre must remain friendly-spooky only, never horror.

Acceptable examples:

- glowing libraries
- whispering portraits
- lost ghost pets
- haunted lighthouses
- silly skeleton keys

Not acceptable:

- gore
- terror
- realistic horror
- death-focused plots
- nightmare imagery

### Genre continuity

The selected genre must persist through the entire session and influence:

- opening-story selection
- episode plan / story-planning metadata
- story continuation prompts
- safe image prompt generation
- fallback scenes
- fallback endings
- any other story scaffolding that currently uses theme/start metadata

If the user selects **Surprise Me!**, randomly choose one actual genre for that session and then keep that chosen genre consistent throughout the entire quest.

Do not let a space quest randomly become a generic forest quest three scenes later unless the story itself gives a clear genre-consistent reason.

### Remove old start-location behavior

Remove the user-facing ability to choose the exact place where the story begins.

Clean up related:

- UI copy
- setup state
- old start-location option data
- story prompt wording
- docs/readme references
- any stale code paths that no longer apply

If internal naming such as `adventureTheme` or similar remains useful, either refactor it cleanly to `genre` or preserve compatibility behind the scenes while ensuring the user-facing concept is clearly genre-based.

## Story-start expansion requirement

Build a scalable, controlled story-start system that supports **literal hundreds** of possible opening combinations without hand-writing hundreds of full static opening paragraphs.

Preferred approach:

- Use curated modular pieces or structured opening seeds.
- Keep pieces genre-aware.
- Keep all generated combinations safe and coherent.
- Ensure every possible opening is associated with a genre.
- Keep the system maintainable and easy to expand later.

The final implementation must support at least **200 distinct valid opening combinations overall**, with meaningful variety distributed across genres.

If helpful, add a small helper, test, or developer-visible count that makes the number of available opening combinations easy to verify.

## Story-quality requirements

- Openings must feel distinct, not like the same sentence with one noun swapped.
- Openings should give the story a clear first situation, hook, and direction.
- The student’s selected genre should be obvious from the start.
- Existing story continuity rules must not regress.
- Action choices must still make sense with what the scene actually says is happening.
- Do not add freeform student input.

## Fallback requirements

Add genre-specific fallback scenes and genre-specific fallback endings so that if AI generation fails, the experience still feels polished and consistent with the chosen genre rather than generic.

Fallbacks must remain:

- safe
- usable
- on-genre
- compatible with the existing game loop

## Acceptance criteria

- Users no longer choose a specific story-start location.
- Users choose a genre instead.
- **Surprise Me!** is the first visible genre option.
- Each story start is associated with a genre.
- The opening system supports at least 200 distinct safe combinations.
- The selected genre shapes the entire quest, including fallbacks.
- Friendly spooky content remains playful, not horror-based.
- Existing story generation, safety validation, and button-based action flow still work.

---

# Section 2: Keep Info Visible Everywhere and Settings Visible After Begin Quest

## Goal

Fix the utility-control behavior during the title/setup/game flow.

## Required behavior

### Info icon

The info icon must appear on all appropriate screens, including:

- title screen
- all setup screens
- confirmation screens
- writing/loading screen
- active game screens
- ending screen

### Settings icon

The settings icon should **not** appear on the title screen.

The settings icon should begin appearing only after the user clicks **Begin Quest**, because that is when session settings such as music become relevant.

After **Begin Quest**, the settings icon must remain available throughout:

- the entire Chronicler setup flow
- confirmation screens
- first loading/writing screen
- active game screens
- ending screen

### Layout requirement

Do not reintroduce overlapping controls.

Keep using or improve the responsive top-control/header layout so:

- info/settings controls do not overlap cards or content
- controls remain tappable on narrow screens
- controls remain visually consistent
- safe-area spacing is respected where needed
- layout remains clean on mobile and desktop

## Acceptance criteria

- Info is visible on the title screen and every later major screen.
- Settings is hidden on the title screen.
- Settings appears immediately after Begin Quest and remains available through setup, gameplay, and ending.
- Utility controls do not overlap content on mobile or desktop.
- Existing session-only settings behavior remains intact.

---

# Section 3: Improve the First Quest Loading Experience

## Goal

When the adventure begins, make the first loading screen feel intentional, immersive, and patient-friendly while the opening story and cover illustration are prepared.

## Required behavior

### In-theme loading screen

The first loading screen after the adventure begins should clearly communicate, in-universe, that:

- the Chronicler is beginning the story
- the Chronicler may be writing the first page
- the Illustrator may still be completing the opening image
- the player may need to wait a moment before the first page is revealed

Use several rotating in-theme messages rather than one static line.

Examples of the intended tone:

- “The Chronicler is opening the first page of your legend...”
- “The Illustrator is adding the final colors to your first scene...”
- “Some tales need a moment for the ink and images to settle...”

Do not use exactly these if better copy fits the app, but keep the same purpose and tone.

### Progress indicator

Use an honest **indeterminate** progress indicator, such as a looping progress bar or animated loading bar.

Do not show fake percentages unless the image/story API actually exposes real progress data.

### Image timing behavior

Preserve the intended image-loading model:

- Intro / cover image: wait for it before showing the opening scene when image generation is enabled.
- Outro / ending image: wait for it before showing the ending when image generation is enabled.
- Normal milestone images during the quest: remain non-blocking so gameplay does not stall.

If intro/outro image generation fails or times out, handle it gracefully using safe fallback behavior rather than hanging forever.

### Additional image/status copy

Expand the available in-theme image status and fallback copy where needed so pending or failed optional image generation still feels intentional rather than broken.

## Acceptance criteria

- The first post-setup loading screen has rotating in-theme Chronicler/Illustrator messages.
- The loading indicator is indeterminate unless real progress exists.
- Intro image behavior remains intentionally blocking when enabled.
- Outro image behavior remains intentionally blocking when enabled.
- Milestone scene images remain non-blocking.
- Failure states remain safe and do not freeze the app.

---

# Section 4: Increase Story Text Size

## Goal

Make the main story prose easier to read by increasing only the rendered story-text font size, without enlarging unrelated interface elements.

## Required work

Inspect the current frontend implementation and find where the main story prose text size is defined. Do not assume the file or selector name before inspecting the code.

Increase the font size used for the **main story text only** by at least **25%** from its current rendered size.

Examples:

- if it is effectively 10px / pt, raise it to at least 12.5 and use an appropriate practical value such as 13
- if it is effectively 12px / pt, raise it to at least 15
- if it is defined in `rem`, calculate the equivalent increase and raise it by at least 25%

## Scope limits

Only increase the font size for the primary story prose shown to the player during the adventure.

Do **not** enlarge unrelated UI elements such as:

- buttons
- action-choice cards
- math problems
- answer choices
- headings
- labels
- progress text
- modal text
- loading-screen copy
- image captions
- utility controls
- HUD text
- other general body text outside the story prose

If story prose appears in more than one scene-related component, make the sizing consistent across all places where the actual narrative text is displayed.

## Layout requirements

After increasing the story text size:

- preserve readable line height
- keep the story comfortable to read on mobile and desktop
- verify the larger text does not create avoidable overlap or broken layouts
- do not shrink other content just to make the larger story text fit
- allow natural vertical growth and scrolling where needed

## Acceptance criteria

- The main story prose is at least 25% larger than before.
- Only story prose changes size; unrelated UI text remains unchanged.
- Story text remains readable and well-spaced on mobile and desktop.
- No new overlap, clipping, or broken layout is introduced.

---

# Section 5: Rename Student-Facing Challenge Levels Everywhere

## Goal

Stop showing “Easy / Medium / Hard / Extreme” to users. Those labels imply value judgments and can make younger students or struggling older students feel bad. Keep the internal keys if useful, but update every visible user-facing surface.

## Required student-facing labels

Use:

- **Adventurer**
- **Hero**
- **Champion**
- **Legend**

Map them internally as:

- Adventurer -> `easy`
- Hero -> `medium`
- Champion -> `hard`
- Legend -> `extreme`

## Student-facing description style

In the UI, use friendly wording as the primary description and show Florida B.E.S.T. alignment as smaller supporting text.

Recommended meaning:

- **Adventurer**
  Practice with Grade 3 math skills
  Smaller supporting text: Florida B.E.S.T. Grade 3 standards

- **Hero**
  Practice with Grade 4 math skills
  Smaller supporting text: Florida B.E.S.T. Grade 4 standards

- **Champion**
  Practice with Grade 5 math skills
  Smaller supporting text: Florida B.E.S.T. Grade 5 standards

- **Legend**
  Advanced Grade 5 math challenges
  Smaller supporting text: Florida B.E.S.T. Grade 5 standards, still within Grade 5

You may improve the exact copy if needed, but preserve the intent.

## Update every visible surface

Replace user-facing Easy / Medium / Hard / Extreme labels wherever users can see them, including but not limited to:

- setup flow
- Quick Start flow
- game HUD
- settings UI
- ending summary
- info modal if any references remain
- README text where describing user-facing labels
- any visible badges, buttons, cards, summaries, or helper text

Internal implementation may continue using `easy`, `medium`, `hard`, and `extreme`.

## Acceptance criteria

- Users do not see Easy / Medium / Hard / Extreme anywhere in normal app UI.
- Users see Adventurer / Hero / Champion / Legend instead.
- Florida B.E.S.T. grade-band support text appears where challenge levels are explained.
- Internal difficulty behavior remains correct.
- Existing difficulty changes during active gameplay still affect future math only and do not reset progress.

---

# Section 6: Expand and Improve the Info Modal

## Goal

Update the information modal so it gives a clearer explanation of the app while staying concise and user-facing.

## Required content

The info modal should cover:

1. What MathQuest Live is
2. How a quest works
3. Safe-by-design approach
4. Privacy / no saved student data
5. AI story generation versus app-generated math
6. Creator/support/social links

### Required explanation points

Make sure the modal communicates that:

- students choose from preset actions rather than typing story content
- AI writes the story scenes and choices
- the app itself generates and checks the math
- no student account or saved progress is required
- the experience is designed to stay safe and age-appropriate

### Remove this section

Remove the dedicated **Challenge Levels** section completely. Challenge levels are already explained during startup, so they do not need a second full section in the modal.

### Keep creator/support links

Retain and present the existing creator/support material cleanly, including:

- Buy Me a Coffee link
- GitHub
- Threads
- Instagram
- TikTok
- “Made for educators with love by Andrew Hall ❤️” or the existing approved equivalent

Even though the app itself should not gain teacher-only features, this creator tagline may remain as branding.

## Acceptance criteria

- Info modal is more useful and better organized.
- Challenge Levels section is removed.
- Privacy, safety, and AI-vs-math responsibilities are clear.
- Existing creator/support/social links remain present.
- The modal is user-facing, not teacher-dashboard-oriented.

---

# Section 7: Reorganize and Prune the README

## Goal

Turn the README into a clean, balanced document for both general visitors/users and developers/self-hosters.

## Required README improvements

### Structure

Reorganize the README with:

- a clear title and short intro
- useful subheaders
- a table of contents
- horizontal separators where they help readability
- logical ordering
- less random accumulation of old notes

### Target audience

Keep the README balanced between:

- people trying to understand what MathQuest Live is
- developers/self-hosters trying to run or contribute to it

Do not turn it into teacher documentation or a hidden teacher manual.

### Prune stale material

Remove obsolete or unnecessary implementation-history notes, including:

- the temporary `MUSIC` folder note
- other stale transitional notes that no longer help current users or developers

### Keep important content

Keep or clearly preserve:

- what MathQuest Live is
- how the game works
- safety/privacy model
- AI story versus app-generated math distinction
- challenge label / standards-band explanation using current user-facing labels
- technical stack
- local development
- Docker / deployment guidance
- relevant environment configuration
- creator/support/social links
- Buy Me a Coffee
- “Made for educators with love by Andrew Hall ❤️”

### Standards wording

Use conservative, accurate standards language.

Prefer wording in the spirit of:

> Math problems include Florida B.E.S.T.-aligned benchmark metadata for internal alignment and transparency. Benchmark descriptions are intentionally conservative and should be verified against official CPALMS/FDOE materials before public release, commercial use, or formal standards reporting. The app does not claim exhaustive coverage of every benchmark.

Do not describe standards metadata as a teacher-only feature.

## Acceptance criteria

- README has a usable table of contents.
- README is clearly sectioned and easier to scan.
- Stale temporary-history notes are removed.
- README remains useful to visitors and developers/self-hosters.
- Creator/support links remain included.
- README contains no newly added teacher-only product language.

---

# Section 8: Complete the Standards Metadata Verification Pass

## Goal

Use the official Florida B.E.S.T. benchmark standards and descriptors already available to the project to complete a real metadata pass for benchmark alignment fields that are still placeholders or conservative approximations.

## Required work

### Inspect official sources first

Before changing standards metadata:

- inspect the current standards reference files
- inspect the official benchmark standards and descriptors available to the repo/project
- compare existing app metadata against those official sources
- identify any placeholders, incomplete fields, overly broad mappings, or incorrect labels

### Update verified metadata

Where official source material supports it, update:

- benchmark code
- benchmark description
- domain
- strand
- reporting category

Use official names verbatim where available and appropriate.

If an official field is not available or cannot be verified, do not invent it. Leave it unset or mark it conservatively rather than guessing.

### Generator mapping accuracy

Review each existing generator’s benchmark mapping against what it actually measures.

If a generator is mapped too broadly or inaccurately:

- correct it conservatively
- do not overclaim standards coverage
- do not label a generator with a benchmark it does not truly practice

### Documentation/reference updates

Update the relevant standards reference docs so the project has a clear record of:

- official benchmark metadata being used
- any corrected mappings
- any remaining unverified or intentionally conservative areas

If current metadata supports fields such as `verificationStatus` or `sourceNote`, use them consistently where helpful. If adding them would be clean and low-risk, you may add them.

### Preserve standards-band model

Keep the approved challenge-band mapping:

- Adventurer / internal easy = Grade 3
- Hero / internal medium = Grade 4
- Champion / internal hard = Grade 5
- Legend / internal extreme = advanced Grade 5 only

Extreme / Legend must remain within Grade 5 limits.

## Acceptance criteria

- Official sources were actually consulted before edits.
- Placeholder or conservative domain/strand/reporting-category metadata is replaced where official verification is available.
- No unofficially guessed metadata is introduced.
- Generator-to-benchmark mappings are at least as accurate as before and improved where needed.
- Reference documentation reflects the verified metadata state.
- Extreme / Legend remains Grade 5 only.

---

# Section 9: Improve Math Variety and Validation

## Goal

Improve replay value and reliability of deterministic app-generated math without moving any math generation into AI.

## Required work

### Prompt-template variety

Add more generator text templates per skill where current wording feels repetitive.

Requirements:

- preserve deterministic generation and answer checking
- keep all math code-generated
- vary wording enough that repeated skills feel less copy-pasted
- keep templates classroom-safe and age-appropriate
- do not let story text generation invent or solve the math

### Variety-group behavior

Preserve and verify the existing variety-group / recent-skill logic so a player does not receive repeated questions from the same skill family before the available skill families for that difficulty have been used when possible.

Example expectation:

- A student should not receive two “subtract within 1000” problems early in a quest while several other available skill families have not yet appeared.

### Per-generator validation

Add targeted validator loops for every individual generator, not only random sampling at the difficulty level.

Validation should cover, as applicable:

- metadata presence
- benchmark data
- answer correctness
- answer choice structure
- duplicate choice prevention
- hint validity
- signatures
- variety metadata
- generator-specific edge cases

### Duplicate-choice stress testing

Add a higher-sample validation or stress script that specifically verifies no duplicate answer choices survive fallback-generation paths, especially for unit-bearing answer formats.

## Acceptance criteria

- Math wording variety is improved across existing skills.
- No AI-generated math is introduced.
- Existing no-repeat / variety-group behavior is preserved or strengthened.
- Every individual generator has targeted validation coverage.
- A high-sample duplicate-choice stress validation exists and passes.
- Existing `npm run validate:math` still passes, and any newly added validation scripts pass too.

---

# Section 10: Ensure Background Music Playlist Loops Correctly

## Goal

Make sure background music continues indefinitely during a long session instead of going silent once every available song has been played once.

## Required behavior

Inspect the current music library and music manager.

Ensure that:

- the available song list can play through in shuffled order
- once all available tracks have been used in the current cycle, the playlist automatically begins another cycle
- the app does not go silent simply because all 22 current songs have played once
- when more than one track exists, avoid repeating the exact same song immediately across the cycle boundary if reasonably simple
- if only one track exists, it may repeat as expected
- all behavior remains session-only
- existing music/effects controls continue to work

Do not add:

- track picker UI
- saved preferences
- persistent listening history
- overbuilt playlist management

## Acceptance criteria

- A long session continues playing music after all available tracks have been exhausted once.
- The playlist loops into a new cycle automatically.
- No persistent storage is introduced.
- Existing music mute/volume/navigation-sound settings still work.

---

# Section 11: Add Browser Smoke Coverage for the Main User Flow

## Goal

Add lightweight automated browser coverage for the most important user flow regressions identified in the audit.

## Required test coverage

Add a minimal smoke-test setup using the existing project test stack if available, or the smallest reasonable addition if not.

The automated browser tests should cover at least:

1. Title screen to setup or Quick Start
2. Beginning a quest
3. Reaching the first story scene
4. Going through one math gate
5. Advancing to the next scene
6. Opening settings during an active math problem
7. Confirming settings changes do not break the active math problem flow

### Test reliability requirements

- Tests must not require real OpenAI calls or real API keys.
- Use route mocking, safe fallback behavior, fixtures, or another maintainable approach after inspecting the existing app architecture.
- Keep the test suite small and focused.
- Do not overbuild a giant end-to-end framework.

### Manual device checks

Document or perform manual checks for:

- mobile/narrow width
- iPhone Safari-sized viewport
- iPad Safari-sized viewport
- 1366x768 classroom-laptop / Chromebook-style viewport

## Acceptance criteria

- There is automated browser smoke coverage for the main game loop.
- There is automated coverage for opening/changing settings during an active math problem.
- Tests do not depend on live AI calls.
- The new tests are documented and runnable.

---

# Section 12: Documentation and Copy Cleanup

## Goal

Make sure all user-facing copy and project docs reflect the new product decisions consistently.

## Required cleanup

Review and update references to:

- old start-location selection
- old “adventure theme” wording where “genre” is now the right user-facing concept
- user-visible Easy / Medium / Hard / Extreme labels
- any stale temporary MUSIC-folder notes
- any now-obsolete docs that mention removed setup behavior
- any references that accidentally imply teacher-only features being added

### User-facing principle

Keep copy focused on:

- students / players
- general users
- developers/self-hosters where appropriate

Do not add:

- teacher dashboards
- teacher-only views
- teacher classroom mode
- teacher launch presets
- teacher-facing timing notes
- teacher-only skill summaries
- printable teacher reports

## Acceptance criteria

- User-facing wording is consistent across app and docs.
- No stale start-location UX references remain.
- No normal user-facing Easy / Medium / Hard / Extreme labels remain.
- No newly added teacher-only feature language appears.
- Docs match the actual behavior after this pass.

---

# Section 13: Final Validation, Review, and Git Checkpointing

## Before finalizing

Review the full diff and verify that the implementation remains coherent across:

- setup flow
- story generation
- image generation
- fallback behavior
- story text sizing
- challenge labels
- standards metadata
- math validation
- audio
- documentation
- tests

## Required commands

Run all relevant validation/build commands, including at minimum:

```sh
npm run build
npm run validate:math
npm run validate:images
```

Also run:

- any newly added per-generator or duplicate-choice validation scripts
- any newly added browser smoke-test command
- any existing relevant test commands

If a command fails, fix the issue before finalizing unless it is impossible within the repo state. Do not silently ignore failures.

## Git checkpointing during implementation

After completing each major numbered section, create a local checkpoint commit before moving on to the next section.

Use clear, section-specific commit messages, for example:

```sh
git add .
git commit -m "Add genre-based quest starts"

git add .
git commit -m "Keep utility controls available through setup"

git add .
git commit -m "Improve first quest loading experience"
```

Do **not** run `git push` after each section.

The user may be away from the computer, and pushing requires local Touch ID approval. Keep all checkpoint commits local until the entire plan is finished, validated, and summarized.

## Final git push

Only after every section is complete, all required validation commands pass, and the final summary is ready:

```sh
git status
git log --oneline --max-count=20
git push
```

If the final push cannot complete because local authentication is unavailable, do not treat that as a code failure. Leave the completed local commits in place and report that the final push is the only remaining manual step.

## Final summary required from Codex

At the end, provide:

1. A concise summary of what changed, grouped by section
2. A list of files changed
3. A list of validations/tests run and their results
4. Any meaningful assumptions made
5. Any remaining known limitations or follow-up items that were intentionally kept out of scope
6. The local commit history created during this work session
7. Whether the final push succeeded or is the only remaining manual step

---

# Final Acceptance Checklist

The work is complete only when all of the following are true:

- [ ] Start-location selection has been replaced by genre selection.
- [ ] Surprise Me! is the first genre option.
- [ ] The genre system supports at least 200 distinct safe opening combinations.
- [ ] Every story start is genre-associated.
- [ ] Selected genre drives the whole quest.
- [ ] Friendly spooky content stays playful and non-horror.
- [ ] Genre-specific fallback scenes and endings exist.
- [ ] Info icon appears on all major screens, including title.
- [ ] Settings icon is hidden on title and visible on all major screens after Begin Quest.
- [ ] First quest-loading screen has rotating Chronicler/Illustrator messages and an honest indeterminate progress indicator.
- [ ] Intro/outro images remain intentionally blocking when enabled; milestone images remain non-blocking.
- [ ] Main story prose is at least 25% larger than before.
- [ ] Only story prose size changed; unrelated UI text remains unchanged.
- [ ] Student-facing challenge labels are Adventurer, Hero, Champion, and Legend everywhere visible.
- [ ] Internal difficulty keys may remain easy, medium, hard, and extreme.
- [ ] Student-facing challenge descriptions use friendly wording with smaller Florida B.E.S.T. support text.
- [ ] Info modal is expanded and the Challenge Levels section is removed.
- [ ] README has a ToC, better structure, cleaner sections, and no stale temporary MUSIC-folder note.
- [ ] README keeps creator/support/social links and Buy Me a Coffee.
- [ ] Official standards metadata pass has been completed for domain, strand, and reporting category where verifiable.
- [ ] No guessed standards metadata was invented.
- [ ] Math generator wording variety has improved.
- [ ] Per-generator validation exists.
- [ ] High-sample duplicate-choice stress validation exists.
- [ ] Variety-group behavior still avoids premature repeats when possible.
- [ ] Background music loops into a new cycle after all available tracks have played.
- [ ] Browser smoke tests cover the core flow and settings during an active math problem.
- [ ] No teacher-facing UI, teacher-only notes, dashboards, classroom mode, presets, or teacher reports were added.
- [ ] No dependency-remediation work was added.
- [ ] No high-readability/simple-text mode was added.
- [ ] Local checkpoint commits were created after each major section.
- [ ] Final push was attempted only after all work and validation were complete.
- [ ] All required builds and validations pass.
