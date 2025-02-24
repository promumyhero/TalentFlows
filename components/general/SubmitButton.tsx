"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  width?: string;
  icon?: ReactNode;
}

export function SubmitButton({
  text,
  variant,
  width,
  icon,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} className={width} disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
}

export function SavedJobButton({ savedJob }: { savedJob: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button variant={"outline"} type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <HeartIcon
            className={cn(
              savedJob ? "fill-current text-red-500" : "",
              "size-4 transition-colors"
            )}
          />
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}
