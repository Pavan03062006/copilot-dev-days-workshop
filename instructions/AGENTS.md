# Dev Days Quiz: agent instructions

## Project rules
- Use plain JavaScript, HTML and CSS. Do not add frameworks, build tools or npm dependencies.
- Keep pure quiz logic in `src/quiz.js`; export it with `module.exports` for Node tests.
- Keep browser DOM access, rendering and event handlers in `src/app.js`.
- Keep quiz data in `src/questions.js` and match its existing object shape.
- Define all colors as CSS variables in `:root`; use the variables throughout the stylesheet.
- Build accessible UI: use buttons for actions, preserve visible focus, and use `aria-live` for changing messages.

## Tests and workflow
- Run `npm test` after logic or test changes.
- Tests use Node's built-in `node:test` and `node:assert/strict`; do not add another test library.
- Review diffs before keeping changes and avoid unrelated refactors.
- Keep functions small, use `const`/`let`, and comment only non-obvious logic.