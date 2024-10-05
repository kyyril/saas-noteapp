"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader, Trash } from "lucide-react";

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
        <Button type="submit">Save</Button>
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
        <Button type="submit">Subscription</Button>
      )}
    </>
  );
}

export function PortalStripe() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader className="mr-1 animate-spin w-4 h-4" />
          Wait..
        </Button>
      ) : (
        <Button type="submit">View payment details</Button>
      )}
    </>
  );
}

export function DeleteNote() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button
          variant={"destructive"}
          size={"icon"}
          type="submit"
          className="w-fit"
          disabled
        >
          <Loader className="mr-1 animate-spin w-4 h-4" />
        </Button>
      ) : (
        <Button size={"icon"} variant={"destructive"} type="submit">
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
