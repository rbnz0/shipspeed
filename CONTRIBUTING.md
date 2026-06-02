# Contributing to ShipSpeed

Thanks for your interest in contributing to ShipSpeed!

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/shipspeed.git
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start development:
   ```bash
   pnpm dev:cli   # Build and watch the CLI
   pnpm dev:www   # Start the docs dev server
   ```

## Project Structure

This is a [Turborepo](https://turborepo.org/) monorepo:

| Directory | Description |
|-----------|-------------|
| `cli/` | The `create-shipspeed` CLI tool |
| `www/` | Documentation site (Astro) |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:cli` | Build and watch the CLI |
| `pnpm dev:www` | Start docs dev server |
| `pnpm build` | Build everything |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint the codebase |

## Making Changes

1. Create a branch for your changes
2. Make your changes
3. Run `pnpm typecheck` to verify
4. Commit using [conventional commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   ```
5. Open a pull request

## Need Help?

Open an [issue](https://github.com/rbnog/shipspeed/issues) or start a [discussion](https://github.com/rbnog/shipspeed/discussions).
