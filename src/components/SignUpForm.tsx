"use client";
import SignUpSchema from "@/validation/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import usePostSignUp from "@/hooks/usePostSignUp";

const SignUpForm = ({ sub, token }: { sub: string; token: string }) => {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: sub as string,
    },
  });
  const signUp = usePostSignUp(token);

  function onSubmit(data: z.infer<typeof SignUpSchema>) {
    console.log("sign up", data);
    signUp.mutateAsync({ username: sub, password: data.password, token });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" grid grid-cols-12 gap-4"
      >
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          disabled
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Username *</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* re-password */}
        <FormField
          control={form.control}
          name="rePassword"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Confirm Password *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirmation password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full flex justify-end">
          <Button
            type="submit"
            disabled={signUp.isPending}
            className="flex gap-2"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
