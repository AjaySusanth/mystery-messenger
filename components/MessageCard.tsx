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
          const axiosError = error as AxiosError<apiResponse>;
          toast({
            title: 'Error',
            description: axiosError.response?.data.message ?? 'Failed to delete message',
            variant: 'destructive',
          });
      }
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className="size-5"/></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default MessageCard