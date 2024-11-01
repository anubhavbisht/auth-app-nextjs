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
import { wholePasswordValidationSchema } from "@/lib/validations";
import { registerUser } from "./actions";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email(),
}).and(wholePasswordValidationSchema)

export default function Register() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: ""
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await registerUser({
            email: data.email,
            password: data.password,
            passwordConfirm: data.passwordConfirm,
        });
        if (response?.error) {
            form.setError("email", {
                message: response?.message,
            });
        }
    };

    return <main className="flex items-center justify-center min-h-screen">
        {form.formState.isSubmitSuccessful ? (
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Your account has been created</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/login">Login to your account</Link>
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Register for a new account.</CardDescription>
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
                                <FormField
                                    control={form.control}
                                    name="passwordConfirm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password confirm</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your password again" {...field} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Register</Button>
                            </fieldset>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <div className="text-muted-foreground text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-black">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>)}
    </main>
}