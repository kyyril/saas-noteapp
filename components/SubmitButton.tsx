"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

export function SubmitButtonSetting() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader className="mr-1 animate-spin w-4 h-4" />
          Wait..
        </Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </>
  );
}

export function SubscribeButtonStripe() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader className="mr-1 animate-spin w-4 h-4" />
          Wait..
        </Button>
      ) : (
        <Button type="submit">Subscribe</Button>
      )}
    </>
  );
}
