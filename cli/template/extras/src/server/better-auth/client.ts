import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa";
      },
    }),
    passkeyClient(),
    adminClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
