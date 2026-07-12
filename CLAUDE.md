# CLIuno React template

React 19 + Vite + TypeScript SPA implementing the CLIuno demo app (auth, users, todos,
posts+comments, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm dev        # vite dev server
pnpm build      # tsc -b && vite build
pnpm lint       # oxlint
pnpm format     # oxfmt src/
```

## Structure

- `src/apis/` — the API layer (`auth-api`, `user-api`, `todo-api`, `post-api`,
  `follow-api`) on an axios instance in `http.ts`; Bearer token from localStorage,
  401 → redirect to `/login`.
- `src/stores/` — zustand (`auth` owns token/user).
- `src/views/` — pages; routing via react-router-dom.
- **Auto-imports**: react/router/axios names (`useState`, `Link`, …) are globals via
  `unplugin-auto-import` — don't add manual imports for them; `src/auto-imports.d.ts` is
  generated, and `.oxlintrc.json` mirrors the names in `globals` so `jsx-no-undef` still
  catches real typos (regenerate that list if auto-imports change).

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are
`{status, message, data}`; components destructure `data.users/user/todos/todo/posts/`
`post/followers/following/isFollowing`. Any CLIuno backend template serves this contract.
Keep all URLs inside `src/apis/`.

## Conventions

- oxc tooling: `oxlint` + `oxfmt` (`semi: false`, single quotes); prettier for css/md/html.
- TypeScript 6.0 (`ignoreDeprecations` is set — don't downgrade TS).
- Conventional commits (commitlint + husky); Tailwind v4 + daisyUI with `tw:` prefix.
