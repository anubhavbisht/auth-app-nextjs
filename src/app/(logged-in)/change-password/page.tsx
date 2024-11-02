import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordForm from "./change-password-form";

export default function ChangePassword() {
    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <ChangePasswordForm/>
            </CardContent>
        </Card>
    );
}