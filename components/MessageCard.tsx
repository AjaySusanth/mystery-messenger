import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { toast, useToast } from "@/hooks/use-toast";

type MessageCardProps = {
    message:Message;
    onMessageDelete: (messageId:any)=>void;
}

const MessageCard = ({message,onMessageDelete} : MessageCardProps)  => {

  const {toast} = useToast()

    const handleConfirmDelete = async() =>{
      try {
        const response  = await axios.delete<apiResponse>(`/api/deleteMessage/${message._id}`)
        toast({
          title: response.data.message,
        });
        onMessageDelete(message._id)

      } catch (error) {
        console.error(error)
          const axiosError = error as AxiosError<apiResponse>;
          toast({
            title: 'Error',
            description: axiosError.response?.data.message ?? 'Failed to delete message',
            variant: 'destructive',
          });
      }
    }
  return (
    <Card className="px-4 py-2">
      <CardHeader>
        <CardDescription className="text-black">{message.content}</CardDescription>
      </CardHeader>
      <AlertDialog>
        <CardFooter>
            <AlertDialogTrigger asChild>
              <Button className="w-40" variant="destructive">
                Delete Message
                <X className="size-5" />
              </Button>
            </AlertDialogTrigger>
        </CardFooter>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
export default MessageCard