import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { SubscribeButtonStripe } from "@/components/SubmitButton";

const featureItems = [
  { name: "lorem ipsum dolor sit amet" },
  { name: "lorem ipsum dolor sit amet" },
  { name: "lorem ipsum dolor sit amet" },
  { name: "lorem ipsum dolor sit amet" },
];

async function getData(userId: string) {
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return data;
}

export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id);

  async function createSubscription() {
    "use server";

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get customer id");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
    });
    return redirect(subscriptionUrl);
  }

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex flex-row gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <p className="text-xl font-semibold text-primary">
            Active Subscription
          </p>
        </div>
        <div className="flex items-center justify-between px-2"></div>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptate blanditiis necessitatibus et, aliquam fuga deleniti!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-9 px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Billings</h1>
          <p className="text-lg text-muted-foreground">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <Card className="flex flex-col mb-14">
          <CardContent className="py-8">
            <div>
              <h3 className="inline-flex px-4 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
                Monthly
              </h3>
            </div>
            <div className="mt-3 flex items-baseline text-4xl font-bold">
              5$
              <span className="text-muted-foreground text-2xl font-semibold">
                /Month
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam, iusto!
            </p>
          </CardContent>
          <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
            <ul className="space-y-4">
              {featureItems.map((item, index) => (
                <li key={index}>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-4 rounded-full bg-primary/10 pb-5 pr-5 text-primary">
                      <CheckCircle />
                    </span>
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
            <form action={createSubscription}>
              <SubscribeButtonStripe />
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
