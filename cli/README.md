<p align="center">
  <h1 align="center">ShipSpeed</h1>
</p>

<p align="center">
  Interactive CLI to start a production-ready, full-stack Next.js app.
</p>

<p align="center">
  Get started by running <code>npm create shipspeed@latest</code>
</p>

<div align="center">

[![PRs-Welcome][contribute-image]][contribute-url] [![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

</div>

## Table of contents

- <a href="#about">What is ShipSpeed?</a>
- <a href="#features">Features</a>
- <a href="#getting-started">Getting Started</a>
- <a href="#community">Community</a>

<h2 id="about">What is ShipSpeed?</h2>

ShipSpeed is a CLI built to streamline the setup of a modern, production-ready Next.js application. It is based on the T3 Stack but adds powerful features out of the box:

- [Next.js](https://nextjs.org) App Router
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Better Auth](https://better-auth.com) - Authentication with organizations, 2FA, passkeys, and more
- [shadcn/ui](https://ui.shadcn.com) - Beautiful, accessible components
- [Prisma](https://prisma.io) or [Drizzle](https://orm.drizzle.team)
- [Resend](https://resend.com) - Transactional emails
- [Polar](https://polar.sh) - Payments and subscriptions
- Optional admin dashboard

Each piece is optional, and the template is generated based on your specific needs.

<h2 id="features">Features</h2>

| Feature              | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| **Better Auth**      | Type-safe auth with email/password, OAuth, organizations, 2FA, passkeys         |
| **shadcn/ui**        | Pre-configured with Tailwind CSS variables, dark mode, and common components    |
| **Payments (Polar)** | Ready-to-go subscription and checkout integration                               |
| **Email (Resend)**   | Transactional email setup with templates                                        |
| **Admin Dashboard**  | Optional standalone admin app for user management                               |
| **Database**         | Choose between Prisma or Drizzle with SQLite, PostgreSQL, MySQL, or PlanetScale |

<h2 id="getting-started">Getting Started</h2>

To scaffold an app using ShipSpeed, run any of the following commands and answer the command prompt questions:

### npm

```bash
npm create shipspeed@latest
```

### yarn

```bash
yarn create shipspeed
```

### pnpm

```bash
pnpm create shipspeed@latest
```

### bun

```bash
bun create shipspeed@latest
```

<h2 id="community">Community</h2>

For help, discussion about best practices, or any other conversation:

[Open an issue on GitHub](https://github.com/rbnog/shipspeed/issues)

## Contributors

We welcome contributors! Feel free to contribute to this project.

<a href="https://github.com/rbnog/shipspeed/graphs/contributors">
  <p align="center">
    <img width="720" src="https://contrib.rocks/image?repo=rbnog/shipspeed" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

[downloads-image]: https://img.shields.io/npm/dm/create-shipspeed?color=364fc7&logoColor=364fc7
[npm-url]: https://www.npmjs.com/package/create-shipspeed
[npm-image]: https://img.shields.io/npm/v/create-shipspeed?color=0b7285&logoColor=0b7285
[contribute-url]: https://github.com/rbnog/shipspeed/blob/main/CONTRIBUTING.md
[contribute-image]: https://img.shields.io/badge/PRs-welcome-blue.svg
