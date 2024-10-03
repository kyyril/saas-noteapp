import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Billings() {
  const featureItems = [
    { name: "lorem ipsum dolor sit amet" },
    { name: "lorem ipsum dolor sit amet" },
    { name: "lorem ipsum dolor sit amet" },
    { name: "lorem ipsum dolor sit amet" },
  ];
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
            <form action="">
              <Button className="w-full" type="submit">
                Buy Now
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
