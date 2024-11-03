import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { users } from "../../../../db/usersSchema";
import db from "../../../../db/drizzle";
import { eq } from "drizzle-orm";
import TwoFactorAuthForm from "./2FA-auth";

export default async function MyAccount() {
    const session = await auth();
    const [user] = await db
        .select({
            twoFactorActivated: users.twoFactorActivated,
        })
        .from(users)
        .where(eq(users.id, parseInt(session?.user?.id ?? "")));

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent>
                <Label>Email Address</Label>
                <div className="text-muted-foreground">{session?.user?.email}</div>
                <TwoFactorAuthForm
                    twoFactorActivated={user.twoFactorActivated ?? false}
                />
            </CardContent>
        </Card>
    );
}