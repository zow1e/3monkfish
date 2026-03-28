# Contributing

## Standards
- Keep features modular and package-scoped.
- Prefer shared types and zod schemas over ad-hoc interfaces.
- Keep prompts versioned in `packages/prompts/src/templates`.
- Avoid embedding secrets in code.

## Development
- Install: `pnpm install`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`

## PR checklist
- [ ] Added/updated docs for new modules
- [ ] Added tests for new logic
- [ ] Added TODO notes for intentionally deferred production concerns
