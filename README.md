<p align="center">
  <img src="https://raw.githubusercontent.com/rbnog/shipspeed/main/www/public/logo.svg" width="120" alt="ShipSpeed Logo">
</p>

<h1 align="center">ShipSpeed</h1>

<p align="center">
  <strong>The fastest way to start a production-ready Next.js app.</strong>
</p>

<p align="center">
  Authentication · Payments · Emails · Admin Dashboard · shadcn/ui
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-shipspeed">
    <img src="https://img.shields.io/npm/v/create-shipspeed?color=0b7285&logoColor=0b7285" alt="NPM version">
  </a>
  <a href="https://www.npmjs.com/package/create-shipspeed">
    <img src="https://img.shields.io/npm/dm/create-shipspeed?color=364fc7&logoColor=364fc7" alt="Downloads">
  </a>
  <a href="https://github.com/rbnog/shipspeed/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://github.com/rbnog/shipspeed/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome">
  </a>
</p>

---

## What is ShipSpeed?

ShipSpeed is an interactive CLI that scaffolds a modern, production-ready Next.js application with everything you need to ship fast. It layers production-ready features — auth, payments, emails, admin — on top of a solid Next.js foundation.

Stop configuring auth, payments, emails, and UI libraries separately. ShipSpeed wires them all together for you.

## Features

| Feature | Library | What You Get |
|---------|---------|--------------|
| **Authentication** | [Better Auth](https://better-auth.com) | Email/password, OAuth (GitHub, Google, etc.), organizations, 2FA, passkeys, admin roles |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) | Pre-configured with Tailwind CSS variables, dark mode, and essential components |
| **Payments** | [Polar](https://polar.sh) | Checkout sessions, customer portal, webhooks — ready for subscriptions |
| **Emails** | [Resend](https://resend.com) | Transactional email helper with type-safe sending |
| **Admin Dashboard** | Custom | User management, organization overview, stats — powered by Better Auth admin plugin |
| **Database** | [Prisma](https://prisma.io) or [Drizzle](https://orm.drizzle.team) | Your choice, with SQLite, PostgreSQL, MySQL, or PlanetScale |
| **API** | [tRPC](https://trpc.io) | End-to-end typesafe APIs (optional) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 | Utility-first styling with CSS variables |

## Quick Start

```bash
# npm
npm create shipspeed@latest

# yarn
yarn create shipspeed

# pnpm
pnpm create shipspeed@latest

# bun
bun create shipspeed@latest
```

Then answer the prompts. ShipSpeed will scaffold your project and install dependencies.

## What Gets Generated?

When you run ShipSpeed with the defaults, you get:

```
my-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts    # Better Auth API routes
│   │   │   └── webhook/polar/route.ts     # Polar webhook handler
│   │   ├── admin/                         # Admin dashboard (optional)
│   │   │   ├── page.tsx                   # Dashboard overview
│   │   │   ├── users/page.tsx             # User management
│   │   │   └── organizations/page.tsx     # Org management
│   │   ├── checkout/route.ts              # Polar checkout redirect
│   │   ├── portal/route.ts                # Polar customer portal
│   │   ├── layout.tsx                     # Root layout with ThemeProvider
│   │   └── page.tsx                       # Landing page
│   ├── components/
│   │   ├── ui/                            # shadcn/ui components
│   │   └── admin/sidebar.tsx              # Admin navigation
│   ├── lib/
│   │   ├── email.ts                       # Resend email helper
│   │   ├── polar.ts                       # Polar SDK client
│   │   └── utils.ts                       # cn() helper
│   ├── server/
│   │   ├── better-auth/
│   │   │   ├── config.ts                  # Auth config with plugins
│   │   │   ├── client.ts                  # Auth client (React)
│   │   │   └── server.ts                  # Server-side session helper
│   │   └── db/                            # Database setup
│   └── env.js                             # Type-safe environment variables
├── components.json                        # shadcn/ui config
├── .env                                   # Environment variables
└── package.json
```

## Interactive Prompts

ShipSpeed asks you what you need — nothing more, nothing less:

1. **Project name** — What should we call your app?
2. **Tailwind CSS** — Modern styling? (default: Yes)
3. **tRPC** — Typesafe APIs? (default: Yes)
4. **shadcn/ui** — Accessible UI components? (default: Yes)
5. **Authentication** — Better Auth, NextAuth, or none? (default: Better Auth)
6. **Database ORM** — Prisma or Drizzle? (default: Prisma)
7. **Database Provider** — SQLite, PostgreSQL, MySQL, or PlanetScale? (default: SQLite)
8. **App Router** — Next.js App Router? (default: Yes)
9. **Resend** — Transactional emails? (default: Yes)
10. **Polar** — Payments and subscriptions? (default: Yes)
11. **Admin Dashboard** — Built-in admin panel? (default: Yes, with Better Auth)
12. **Linter** — ESLint/Prettier or Biome? (default: ESLint)
13. **Git** — Initialize a repo? (default: Yes)
14. **Install** — Run `pnpm install`? (default: Yes)

Every feature is optional. Ship only what you need.

## After Scaffolding

```bash
cd my-app

# 1. Set up your environment variables
#    Edit .env with your real API keys

# 2. Generate the database schema (if using Better Auth + DB)
npx @better-auth/cli@latest migrate

# 3. Push the database schema (if using Prisma/Drizzle)
pnpm db:push

# 4. Start the dev server
pnpm dev
```

### Environment Variables Checklist

```env
# Required for Better Auth
BETTER_AUTH_SECRET=           # openssl rand -base64 32
BETTER_AUTH_GITHUB_CLIENT_ID=
BETTER_AUTH_GITHUB_CLIENT_SECRET=

# Required for database
DATABASE_URL=                 # e.g., file:./db.sqlite

# Required for Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Required for Polar
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_ENV=sandbox             # or production

# General
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Better Auth Plugins

ShipSpeed enables all major Better Auth plugins by default:

- **Organization** — Multi-tenancy, teams, member invites
- **Two-Factor Authentication** — TOTP-based 2FA with backup codes
- **Passkey** — WebAuthn passwordless login
- **Admin** — User management, role assignment, banning, impersonation

Run `npx @better-auth/cli@latest migrate` after scaffolding to generate the database schema for all plugins.

## Admin Dashboard

If you opt in, ShipSpeed creates an `/admin` route with:

- **Dashboard** — Overview stats (users, orgs, sessions)
- **Users** — List, view roles, ban status (via Better Auth admin API)
- **Organizations** — Placeholder for org management

The admin dashboard is protected by Better Auth's admin plugin. Only users with the `admin` role can access it.

## Why ShipSpeed?

Most boilerplates give you a blank canvas. ShipSpeed gives you a **running start**:

- ✅ Auth is configured, not just installed
- ✅ Payments have working routes, not just a SDK
- ✅ Emails have a helper, not just a package
- ✅ Admin dashboard is functional, not just a idea
- ✅ Dark mode works out of the box
- ✅ Every choice is optional — remove what you don't need

## Tech Stack

- [Next.js](https://nextjs.org) 15 (App Router)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Better Auth](https://better-auth.com)
- [shadcn/ui](https://ui.shadcn.com)
- [tRPC](https://trpc.io) (optional)
- [Prisma](https://prisma.io) or [Drizzle](https://orm.drizzle.team) (optional)
- [Resend](https://resend.com) (optional)
- [Polar](https://polar.sh) (optional)

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) before opening an issue or PR.

## Community

- [GitHub Issues](https://github.com/rbnog/shipspeed/issues) — Bug reports and feature requests
- [GitHub Discussions](https://github.com/rbnog/shipspeed/discussions) — Questions and ideas

## Acknowledgments

ShipSpeed is based on [create-t3-app](https://github.com/t3-oss/create-t3-app) by the [T3 Stack](https://github.com/t3-oss) team. We're grateful for their work in establishing the foundation that ShipSpeed builds upon.

## License

MIT © [ShipSpeed](https://github.com/rbnog/shipspeed)

---

<p align="center">
  Built with ❤️ by the ShipSpeed team
</p>
