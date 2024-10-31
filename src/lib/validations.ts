import { z } from 'zod'

const passwordSchema = z.string().min(5, "Password must contain at least 5 characters");

export const wholePasswordValidationSchema = z.object({
    password: passwordSchema,
    passwordConfirm: z.string()
}).superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["passwordConfirm"],
            message: "Passwords do not match",
        })
    }
})