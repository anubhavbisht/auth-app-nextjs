'use client'

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
import { passwordSchema } from "@/lib/validations";
import { loginWithCredentials } from "./actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email(),
    password: passwordSchema
})

export default function Login() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await loginWithCredentials({
            email: data.email,
            password: data.password
        })
        if (response?.error) {
            form.setError('root', {
                message: response?.message,
            });
        } else {
            router.push("/my-account");
        }
    };

    return <main className="flex items-center justify-center min-h-screen">
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your account.</CardDescription>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!!form.formState.errors.root?.message && (
                                <FormMessage>
                                    {form.formState.errors.root.message}
                                </FormMessage>
                            )}
                            <Button type="submit">Login</Button>
                        </fieldset>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <div className="text-muted-foreground text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline text-black">
                        Register
                    </Link>
                </div>
                <div className="text-muted-foreground text-sm">
                    Forgot password?{" "}
                    <Link
                        href={`/password-reset`}
                        className="underline text-black"
                    >
                        Reset my password
                    </Link>
                </div>
            </CardFooter>
        </Card>
    </main>
}