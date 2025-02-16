import { Control } from "react-hook-form";
import { Slider } from "../ui/slider";

interface SalaryRangeSelectorProps {
  control: Control;
  minSalary: number;
  maxSalary: number;
  step: number;
  currency: string;
}

export function SalaryRangeSelector({
  control,
  minSalary,
  maxSalary,
  step,
  currency,
}: SalaryRangeSelectorProps) {
  return (
    <div className="w-full space-y-4">
      <Slider max={100} step={1} />
    </div>
  );
}
