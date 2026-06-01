import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "ShipSpeed",
  emailAndPassword: {
    enabled: true,
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
