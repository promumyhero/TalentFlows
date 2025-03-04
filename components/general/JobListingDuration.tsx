/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { jobListingDurationPricing } from "@/app/utils/jobListingDurationPricing";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { FormControl } from "../ui/form";

interface JobListingDurationProps {
  field: ControllerRenderProps<any, "listingDuration">;
}

export function JobListingDuration({ field }: JobListingDurationProps) {
  return (
    <FormControl>
      <RadioGroup
        value={field.value?.toString()}
        onValueChange={(value) => field.onChange(parseInt(value))}
      >
        <div className="grid gap-4">
          {jobListingDurationPricing.map((duration) => (
            <div key={duration.days} className="relative">
              <RadioGroupItem
                value={duration.days.toString()}
                id={duration.days.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={duration.days.toString()}
                className="flex flex-col cursor-pointer"
              >
                <Card
                  className={cn(
                    field.value === duration.days
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary bg-secondary/50", // lawak bagian ini sumpah
                    "p-4 border-2 transition-all"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        {duration.days} Days
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {duration.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">Rp.{duration.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Rp.{(duration.price / duration.days).toFixed()}/day
                      </p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FormControl>
  );
}
