'use client'
import { useToast } from "@/hooks/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Page = () => {
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema)
    })

    const onSubmit = async(data:z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verifyCode",{
                username:params.username,
                code: data.verifyCode
            })
            if (!response.data.success) throw new Error("Error in verifying code");

            toast({
                title:"Success",
                description:response.data.message
            })
            router.replace('/signin')

        } catch (error) {
            console.error('Error in verifying code',error)
            const axiosError = error as AxiosError<apiResponse>
            let errorMessage = axiosError.response?.data.message ?? "Error in verifying code"
            toast({
            title:'Verification failed',
            description:errorMessage,
            variant:"destructive"
            })
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl text-gray-950 font-extrabold tracking-tight lg:text-5xl mb-6">Verify your account</h1>
                <p className="mb-4">Enter the verification code send to your email</p>
            </div>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="verifyCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    </div>
  )
}
export default Page