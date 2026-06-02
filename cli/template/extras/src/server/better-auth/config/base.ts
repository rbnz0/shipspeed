import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins";

import { sendEmail } from "~/lib/email";

export const auth = betterAuth({
  appName: "ShipSpeed",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Click the link below to verify your email:</p><a href="${url}">Verify Email</a>`,
      });
    },
    sendResetPasswordEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
      });
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
