'use server'

import { wholePasswordValidationSchema } from '@/lib/validations';
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from 'zod'
import { users } from "../../../../../db/usersSchema";
import db from '../../../../../db/drizzle';
import { auth } from '@/auth';

export const changePassword = async ({
    currentPassword,
    password,
    passwordConfirm,
}: {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
}) => {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: true,
            message: "You must be logged in to change your password.",
        };
    }

    const changePasswordSchema = z
        .object({
            currentPassword: z.string(),
        })
        .and(wholePasswordValidationSchema);

    const changePasswordValidation = changePasswordSchema.safeParse({
        currentPassword,
        password,
        passwordConfirm,
    });

    if (!changePasswordValidation.success) {
        return {
            error: true,
            message:
                changePasswordValidation.error.issues[0]?.message ?? "An error occurred",
        };
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(session.user.id)));

    if (!user) {
        return {
            error: true,
            message: "User not found",
        };
    }

    const passwordMatch = await compare(currentPassword, user.password!);

    if (!passwordMatch) {
        return {
            error: true,
            message: "Current password is incorrect",
        };
    }

    const hashedPassword = await hash(password, 10);

    await db
        .update(users)
        .set({
            password: hashedPassword,
        })
        .where(eq(users.id, parseInt(session.user.id)));
}