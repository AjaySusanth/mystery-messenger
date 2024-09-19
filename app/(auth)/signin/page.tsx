'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {

  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })

  const onSubmit = async(data:z.infer<typeof signInSchema>) => {
      console.log(data.identifier)
      const result = await signIn('credentials',{
        identifier:data.identifier,
        password:data.password,
        redirect:false
      })

      console.log(result)

      if (result?.error) {
        // TODO: Check doc for result.error === credentialsSignin then handle credential error and handle the unexpoected error
        console.error(result.error)
        toast({
          title:"Login failed",
          description:"Incorrect email or password",
          variant:"destructive"
        })
      }
      if(result?.url) {
        router.replace('/dashboard')
      }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl text-gray-950 font-extrabold tracking-tight lg:text-5xl mb-6">Sign In</h1>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username/email" 
                    {...field} 
                    />
                 </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" 
                    {...field} 
                    />
                 </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <Button type="submit">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Don't have an account'?{' '}
              <Link href="/signup" className="text-gray-950 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default page