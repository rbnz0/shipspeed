import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("Received Polar webhook:", payload);
    // TODO: Handle webhook events (subscriptions, orders, etc.)
  },
});
