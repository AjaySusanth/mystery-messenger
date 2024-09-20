import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function DELETE (request:Request,{params}:{params:{messageId:string}}) {
    const messageId = params.messageId
    dbConnect()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const user  = session?.user as User

    try {
        const result = await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )

        if(result.modifiedCount === 0 ) {
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message deleted"
        },{status:200})
    } catch (error) {
        console.log("Error deleting message",error)
        return Response.json({
            success:false,
            message:"Error deleting message"
        },{status:500})
    }
} 