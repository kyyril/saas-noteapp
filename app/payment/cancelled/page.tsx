import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function CancellPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-auto flex flex-col items-center text-center">
        <CardHeader className="flex justify-center items-center">
          <XIcon className="w-14 h-14 text-red-500" />
        </CardHeader>
        <CardContent>
          <h1 className="font-bold">Subscription Unsuccessful</h1>
          <p className="text-sm text-muted-foreground">
            Dont worry, lets give it another shot!
          </p>
          <Link href={"/dashboard"}>
            <Button className="mt-4 w-full">
              <ArrowLeft /> Go Back
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
