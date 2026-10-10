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
- Conventional commits (commitlint + husky); Tailwind v4 (no prefix) + **shadcn/ui on
  Base UI primitives** — components vendored in `src/components/ui/`, `cn()` in
  `src/lib/utils.ts`, theme tokens in `src/assets/index.css`, dark mode = `.dark` class;
  add components with `npx shadcn@latest add <name> -y` (if files land in a literal
  `./@/` dir, move them into `src/`).

## AI agents (Claude Code and friends)

- **Check the CLIuno skills first**: `npx cliuno@latest skills status` — if any is
  `missing`/`outdated`, run `npx cliuno@latest skills install` (adds `.claude/skills/cliuno-*`:
  the generator workflow, the scaffold guide, and the shared REST contract).
- **Generate resources, don't hand-write them**:
  `npx cliuno@latest make:resource Product --fields name:string,price:number,inStock:boolean`
  creates `src/apis/product-api.ts`, `src/views/app/ProductsView.tsx`, `src/views/app/ProductDetailView.tsx` and registers it in `src/apis/index.ts`, `src/router/index.tsx`, following this
  template's conventions and the `{status, message, data}` contract. `--dry-run` previews,
  re-running never duplicates registrations, `--force` overwrites.
- Single pieces: `make:api`, `make:page`, `make:store`, `make:component` (→ `npx shadcn@latest add`). `npx cliuno@latest make` lists them.
- Then edit fields/business logic only, and run the gates above.
