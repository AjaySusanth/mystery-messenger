'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { apiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const Page = () => {

  const [username,setUsername] = useState("")
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debounce= useDebounceCallback(setUsername,500)
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async() => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response  = await axios.get(`/api/checkUsernameUnique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])


  const onSubmit = async(data:z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
        const response =  await axios.post('/api/signup',data)

        if(!response.data.success) throw new Error("Signup failed")
        toast({
          title:'Success',
          description:response.data.message
        })
        router.replace(`/verify/${username}`)
      } catch (error) {
        console.error('Error in signing up user',error)
        const axiosError = error as AxiosError<apiResponse>
        let errorMessage = axiosError.response?.data.message ?? "Error in signing up user"
        toast({
          title:'Signup failed',
          description:errorMessage,
          variant:"destructive"
        }) 
      }
      finally {
        setIsSubmitting(false)
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl text-gray-950 font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Messenger</h1>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" 
                    {...field} 
                    onChange={(e)=> {
                      field.onChange(e)
                      debounce(e.target.value)
                    }}
                    />
                 </FormControl>
                 {
                    isCheckingUsername && <Loader2 className="animate-spin size-3"/>
                 }
                 <p className={`text-sm ${usernameMessage ==='Username is available' ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                 </p>
                </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" 
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
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin"/> Please wait
                    </>
                  ) 
                  
                  : ("Signup")
                }
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/signin" className="text-gray-950 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Page