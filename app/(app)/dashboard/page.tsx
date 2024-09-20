'use client'
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptingMessageSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User } from "next-auth"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"


const page = () => {

  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitching,setIsSwitching] = useState(false)

  const {toast} = useToast()
  const router = useRouter()

  const handleMessageDelete = (messageId:string) => {
    setMessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitching(true)
    try {
      const response = await axios.get('/api/acceptMessages')
      setValue('acceptMessages',response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Unexpected Error",
        description:axiosError.response?.data.message || "Failed to fetch message acceptance status",
        variant:'destructive'
      })
    }
    finally {
      setIsSwitching(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitching(false)
    try {
      const response = await axios.get('/api/getMessages')
      setMessages(response.data.messages || [])
      if(refresh) {
        toast({
          title:"Refreshed messages",
          description:"Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Unexpected Error",
        description:axiosError.response?.data.message || "Failed to fetch messages",
        variant:'destructive'
      })
    }
    finally {
      setIsLoading(false)
      setIsSwitching(false)
    }
  },[setIsLoading,setMessages])

  useEffect(()=>{
    if(!session || !session.user) {
      router.replace('/signin');
      return;
    }
    fetchMessages()
    fetchAcceptMessage()
  },[session,setValue,fetchMessages,fetchAcceptMessage])

  const handleSwitchChange = async() => {
    try {
      const response = await axios.post<apiResponse>('/api/acceptMessages',{
        acceptMessage:!acceptMessages
      })

      setValue('acceptMessages',!acceptMessages)
      toast({
        title:response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Unexpected Error",
        description:axiosError.response?.data.message || "Failed to update message acceptance status",
        variant:'destructive'
      }) 
    }
  }

  if (!session || !session.user) {
    return <div></div>;
  }


  const {username} = session.user as User

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;


  const copyToClipboard = ()=> {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Profile Url copied to clipboard"
    })
  }

 
  return (
    <div  className="my-8 mx-auto lg:mx-auto p-6 bg-white rounded w-full lg:max-w-6xl md:max-w-4xl">
      <h1  className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input bg-slate-100 input-bordered rounded-md p-2 mr-2 w-full"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
export default page