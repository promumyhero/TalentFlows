/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { benefits } from "@/app/utils/listOfBenefits";
import { Badge } from "../ui/badge";

interface BenefitsSelectorProps {
  field: any;
}


/**
 * BenefitsSelector is a component that renders a list of benefits that can be toggled on or off.
 *
 * It expects a `field` prop which is an object with a `value` property that is an array of strings
 * representing the IDs of the selected benefits. The component will update this value when the user
 * toggles a benefit on or off.
 *
 * The component renders a list of badges, one for each benefit. The badge is rendered with the
 * "default" variant if the benefit is selected, and with the "outline" variant if it is not.
 *
 * The component also renders a text that displays the number of selected benefits.
 */
export function BenefitsSelector({ field }: BenefitsSelectorProps) {
  function toggleBenefit(benefitId: string) {
    const currentBenefits = field.value || [];

    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);
          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 select-none text-sm px-4 py-1.5 rounded-full"
              onClick={() => toggleBenefit(benefit.id)}
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Selected Benefits:{" "}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  );
}
