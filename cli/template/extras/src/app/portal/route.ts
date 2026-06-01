import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: () => {
    // TODO: Resolve the Polar customer ID from your auth session
    return "polar_customer_id_or_external_id";
  },
  server: process.env.POLAR_ENV === "production" ? "production" : "sandbox",
});
