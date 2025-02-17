import { formatCurrency } from "./formatCurrency";

interface JobListingDurationPricing {
  days: number;
  price: number;
  description: string;
  formattedPrice: string;
}

export const jobListingDurationPricing: JobListingDurationPricing[] = [
  {
    days: 30,
    price: 750000,
    formattedPrice: formatCurrency(750000),
    description: "Standard listing",
  },
  {
    days: 60,
    price: 1500000,
    formattedPrice: formatCurrency(1500000),
    description: "Premium listing",
  },
  {
    days: 90,
    price: 2250000,
    formattedPrice: formatCurrency(2250000),
    description: "Exclusive listing",
  },
];
