"use client"

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { ReactNode } from "react";

interface SubmitButtonProps {
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    width?: string
    icon?: ReactNode
}

export function SubmitButton({ text, variant, width, icon }: SubmitButtonProps) {
    const { pending } = useFormStatus ();
    return (
        <Button variant={variant} className={width} disabled={pending}>
            {pending ? (
                <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Loading...</span>
                </>
            ): (
                <>
                {icon && <div>{icon}</div>}
                    <span>{text}</span>
                </>
            )}
        </Button>
    )
}