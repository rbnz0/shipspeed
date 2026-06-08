import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    switch (payload.type) {
      case "subscription.created": {
        // Handle new subscription
        console.log("Subscription created:", payload.data);
        break;
      }
      case "subscription.updated": {
        // Handle subscription update (plan change, cancel, etc.)
        console.log("Subscription updated:", payload.data);
        break;
      }
      case "subscription.revoked": {
        // Handle subscription revocation
        console.log("Subscription revoked:", payload.data);
        break;
      }
      case "order.created": {
        // Handle new order/payment
        console.log("Order created:", payload.data);
        break;
      }
      case "order.refunded": {
        // Handle refund
        console.log("Order refunded:", payload.data);
        break;
      }
      case "customer.created": {
        console.log("Customer created:", payload.data);
        break;
      }
      default: {
        console.log(
          "Unhandled Polar webhook event:",
          payload.type,
          payload.data
        );
      }
    }
  },
});
