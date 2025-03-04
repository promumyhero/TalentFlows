import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters long." }),
  about: z
    .string()
    .min(10, { message: "Please tell us a little bit about your company." }),

  logo: z.string().min(1, { message: "Please upload a logo." }),
  website: z.string().url({ message: "Please enter a valid URL." }),

  xAccount: z.string().optional(),
});

export const jobSeekerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  about: z
    .string()
    .min(10, { message: "Please tell us a little bit about yourself." }),
  resume: z.string().min(1, { message: "Please upload a resume." }),
});

export const jobSchema = z.object({
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters long." }),
  employementType: z
    .string()
    .min(1, { message: "Please select an employment type." }),
  location: z.string().min(1, { message: "Please select a location." }),
  salaryFrom: z.number().min(1, { message: "Salary from required." }),
  salaryTo: z.number().min(1, { message: "Salary to required." }),
  jobDescription: z
    .string()
    .min(1, { message: "Please tell us a little bit about the job." }),
  listingDuration: z.number().min(1, { message: "Listing duration required." }),
  benefits: z
    .array(z.string())
    .min(1, { message: "Please select at least one benefit." }),
  companyName: z.string().min(1, { message: "Company name required." }),
  companyLocation: z.string().min(1, { message: "Company location required." }),
  companyAbout: z.string().min(1, { message: "Company description required." }),
  companyLogo: z.string().min(1, { message: "Company logo required." }),
  companyDescription: z.string().min(1, "Company description is required"),
  companyWebsite: z.string().min(1, { message: "Company website required." }),
  companyXAccount: z.string().optional(),
});
