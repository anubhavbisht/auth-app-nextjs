"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { passwordReset } from "./actions";

const formSchema = z.object({
    email: z.string().email(),
})

export default function PasswordReset() {
    const searchParams = useSearchParams()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: decodeURIComponent(searchParams.get("email") ?? ""),
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        await passwordReset(data.email);
    };

    return <main className="flex items-center justify-center min-h-screen">
        {form.formState.isSubmitSuccessful ? (
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Email Sent</CardTitle>
                </CardHeader>
                <CardContent>
                    If you have an account with us you will receive a password reset
                    email at {form.getValues("email")}
                </CardContent>
            </Card>
        ) : (
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Password Reset</CardTitle>
                    <CardDescription>
                        Enter your email address to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.formState.errors.root?.message && (
                                    <FormMessage>
                                        {form.formState.errors.root.message}
                                    </FormMessage>
                                )}
                                <Button type="submit">Reset</Button>
                            </fieldset>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div>
                        Remember your password?{" "}
                        <Link href="/login" className="underline text-black">
                            Login
                        </Link>
                    </div>
                    <div>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline text-black">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>)}
    </main>
}