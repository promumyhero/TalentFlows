/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Control, useController } from "react-hook-form";
import { Slider } from "../ui/slider";
import { useState } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface SalaryRangeSelectorProps {
  control: Control<any>;
  minSalary: number;
  maxSalary: number;
  step: number;
}

export function SalaryRangeSelector({
  control,
  minSalary,
  maxSalary,
  step,
}: SalaryRangeSelectorProps) {
  const { field: salaryFromField } = useController({
    name: "salaryFrom",
    control,
  });
  const { field: salaryToField } = useController({
    name: "salaryTo",
    control,
  });

  function handleChangeRange(value: [number, number]) {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    salaryFromField.onChange(newRange[0]);
    salaryToField.onChange(newRange[1]);
  }

  const [range, setRange] = useState<[number, number]>([
    salaryFromField.value || minSalary,
    salaryToField.value || maxSalary / 2,
  ]);
  return (
    <div className="w-full space-y-4">
      <Slider
        onValueChange={handleChangeRange}
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
      />
      <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
    </div>
  );
}
