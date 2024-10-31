"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
        console.log(response)
    };

    return <main className="flex items-center justify-center min-h-screen">
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Register for a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
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
                    </form>
                </Form>
            </CardContent>
        </Card>
    </main>
}