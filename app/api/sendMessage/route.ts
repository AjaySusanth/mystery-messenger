import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request:Request) {
    await dbConnect()
    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user) {
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        // if user is not accepting message
        if(!user.isAcceptingMessage) {
            return Response.json({
                success:false,
                message:"User is not accepting any message"
            },{status:403})
        }   
        
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success : true,
            message:"Message sent succesfully"
        },{status:200})


    } catch (error) {
        console.log("Error sending message",error)
        return Response.json({
            success:false,
            message:"Error sending message"
        },{status:500})
    }
}