"use client";
import { messagesSchema } from "@/schemas/messagesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { useToast } from "@/hooks/use-toast";

const Page = () => {

  const {toast} = useToast()
  const [isLoading,setIsLoading] = useState(false)

  const params = useParams();
  const username = params.username;

  const form = useForm<z.infer<typeof messagesSchema>>({
    resolver: zodResolver(messagesSchema),
  });

  const onSubmit = async(data:z.infer<typeof messagesSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<apiResponse>('/api/sendMessage',{
        ...data,
        username
      })

      if(!response.data.success) {
        toast({
          title:response.data.message,
          variant:"destructive"
        })
        return;
      }

      toast({
        title:response.data.message,
      })
      form.reset({...form.getValues(),content:""})
    } catch (error) {
        console.error(error)
        const axiosError = error as AxiosError<apiResponse>
        toast({
          title:"Unexpected Error",
          description:axiosError.response?.data.message || "Failed to send message",
          variant:'destructive'
        }) 
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" placeholder="Write an anonymous message"
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/*
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
      */}

    </div>
  );
};
export default Page;
