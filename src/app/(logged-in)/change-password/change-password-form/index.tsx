'use client'

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
import { changePassword } from './actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    currentPassword: z.string(),
}).and(wholePasswordValidationSchema)

export default function ChangePasswordForm() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            passwordConfirm: ""
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await changePassword({
            currentPassword: data.currentPassword,
            password: data.password,
            passwordConfirm: data.passwordConfirm,
        });
        if (response?.error) {
            form.setError("root", {
                message: response.message,
            });
        } else {
            form.reset();
            toast({
                title: "Password changed",
                description: "Your password has been updated.",
                className: "bg-green-500 text-white",
            });
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your current password" {...field} type="password" />
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
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your new password" {...field} type="password" />
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
                                        <Input placeholder="Enter your new password again" {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.formState.errors.root?.message && (
                            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
                        )}
                        <Button type="submit">Change Password</Button>
                    </fieldset>
                </form>
            </Form>
        </>
    )
}