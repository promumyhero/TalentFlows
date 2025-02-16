import { z } from "zod"

export const companySchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters long."}),
    location: z.string().min(2, {message: "Location must be at least 2 characters long."}),
    about: z.string().min(10, {message: "Please tell us a little bit about your company."}),

    logo: z.string().min(1, {message: "Please upload a logo."}),
    website: z.string().url({message: "Please enter a valid URL."}),

    xAccount: z.string().optional(),
})

export const jobSeekerSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters long."}),
    about: z.string().min(10, {message: "Please tell us a little bit about yourself."}),
    resume: z.string().min(1, {message: "Please upload a resume."}),
})