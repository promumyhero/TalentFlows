"use client";

import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Link2Icon } from "lucide-react";

export function CopyLinkMenuItem({ jobUrl }: { jobUrl: string }) {
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy to clipboard");
    }
  }
  return (
    <DropdownMenuItem onSelect={copyToClipboard}>
      <Link2Icon className="size-4" />
      <span>Copy Link</span>
    </DropdownMenuItem>
  );
}
