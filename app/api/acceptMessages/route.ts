import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";


export async function POST (request:Request) {
    dbConnect()

    const session = await getServerSession(authOptions)
    const user:User  = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const userId = user._id
    
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessage},
            {new:true}
        )

        if(!updatedUser) {
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message acceptance updated",
            updatedUser
        },{status:200})
        
    } catch (error) {
        console.log("Error updating message acceptance status",error)
        return Response.json({
            success:false,
            message:"Error updating message acceptance status"
        })
    }


}
