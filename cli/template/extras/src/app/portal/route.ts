import { auth } from "@/server/better-auth/config";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req: Request) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      return session?.user?.id ?? "";
    } catch {
      return "";
    }
  },
  server: process.env.POLAR_ENV === "production" ? "production" : "sandbox",
});
