import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins";

import { env } from "~/env";
import { db } from "~/server/db";

export const auth = betterAuth({
  appName: "ShipSpeed",
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/github",
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
    }),
    twoFactor({
      issuer: "ShipSpeed",
    }),
    passkey(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    // Make sure nextCookies() is the last plugin in the array
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
