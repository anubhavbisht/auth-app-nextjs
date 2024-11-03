'use server'

import { auth } from "@/auth"
import db from "../../../../db/drizzle";
import { users } from "../../../../db/usersSchema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { passwordResetTokens } from "../../../../db/passwordResetTokensSchema";
import { mailer } from "@/lib/email";

export const passwordReset = async (email: string) => {
    const session = await auth()
    if (session?.user?.id) {
        return {
            error: true,
            message: "You are already logged in",
        }
    }
    const [user] = await db
        .select({
            id: users.id,
        })
        .from(users)
        .where(eq(users.email, email));

    if (!user) {
        return;
    }

    const passwordResetToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000);

    await db
        .insert(passwordResetTokens)
        .values({
            userId: user.id,
            token: passwordResetToken,
            tokenExpiry,
        })
        .onConflictDoUpdate({
            target: passwordResetTokens.userId,
            set: {
                token: passwordResetToken,
                tokenExpiry,
            },
        });

    const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;
    await mailer.sendMail({
        from: "test@resend.dev",
        subject: "Your password reset request",
        to: email,
        html: `Hey, ${email}! You requested to reset your password.
    Here's your password reset link. This link will expire in 1 hour:
    <a href="${resetLink}">${resetLink}</a>`,
    });
}