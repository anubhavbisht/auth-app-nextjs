import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default async function MyAccount() {
    const session = await auth();
    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent>
                <Label>Email Address</Label>
                <div className="text-muted-foreground">{session?.user?.email}</div>
            </CardContent>
        </Card>
    );
}