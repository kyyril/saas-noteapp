import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  if (!signature) {
    return new Response("Missing Stripe signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Stripe webhook verification failed:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  // 1. Idempotency Check: Prevent duplicate event processing (At-least-once delivery guarantee)
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { id: event.id },
  });

  if (existingEvent) {
    return new Response("Event already processed (idempotent)", { status: 200 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const customerId = String(session.customer);

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
      });

      if (!user) {
        console.error("User not found for Stripe customer:", customerId);
        return new Response("User not found", { status: 404 });
      }

      // Atomic transactional execution: Deduplication + Subscription + Audit Trail
      await prisma.$transaction([
        prisma.webhookEvent.create({
          data: {
            id: event.id,
            type: event.type,
          },
        }),
        prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          create: {
            stripeSubscriptionId: subscription.id,
            userId: user.id,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            planId: subscription.items.data[0].plan.id,
            invterval: String(subscription.items.data[0].plan.interval),
          },
          update: {
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            planId: subscription.items.data[0].plan.id,
            invterval: String(subscription.items.data[0].plan.interval),
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "SUBSCRIPTION_CREATED",
            details: `Plan: ${subscription.items.data[0].plan.id}, Status: ${subscription.status}, EventId: ${event.id}`,
            ipAddress: "stripe.webhook",
            userAgent: "Stripe-Webhook-Service",
          },
        }),
      ]);
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const existingSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        await prisma.$transaction([
          prisma.webhookEvent.create({
            data: {
              id: event.id,
              type: event.type,
            },
          }),
          prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              planId: subscription.items.data[0].price.id,
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
              status: subscription.status,
            },
          }),
          ...(existingSub
            ? [
                prisma.auditLog.create({
                  data: {
                    userId: existingSub.userId,
                    action: "SUBSCRIPTION_UPDATED" as const,
                    details: `Invoice payment succeeded. Status: ${subscription.status}, EventId: ${event.id}`,
                    ipAddress: "stripe.webhook",
                    userAgent: "Stripe-Webhook-Service",
                  },
                }),
              ]
            : []),
        ]);
      } else {
        await prisma.webhookEvent.create({
          data: { id: event.id, type: event.type },
        });
      }
    } else if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      // Handles cancellation, expiration, plan changes, or non-payment
      const subscription = event.data.object as Stripe.Subscription;

      const existingSub = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (existingSub) {
        await prisma.$transaction([
          prisma.webhookEvent.create({
            data: {
              id: event.id,
              type: event.type,
            },
          }),
          prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status, // e.g. "canceled", "past_due", "unpaid"
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
            },
          }),
          prisma.auditLog.create({
            data: {
              userId: existingSub.userId,
              action: "SUBSCRIPTION_UPDATED",
              details: `Subscription status changed to: ${subscription.status} (${event.type}), EventId: ${event.id}`,
              ipAddress: "stripe.webhook",
              userAgent: "Stripe-Webhook-Service",
            },
          }),
        ]);
      } else {
        await prisma.webhookEvent.create({
          data: { id: event.id, type: event.type },
        });
      }
    } else {
      // Record any unhandled event as acknowledged
      await prisma.webhookEvent.create({
        data: { id: event.id, type: event.type },
      });
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
