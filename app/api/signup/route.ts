import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request:Request) {
    await dbConnect()

    try {
        const {username,email,password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true})

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success:false, message:"Username already exists"
            },{status:400})

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        
        if(existingUserByEmail) {
            return;
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10)
            const verifyCodeExpiryDate = new Date() 
            verifyCodeExpiryDate.setHours(verifyCodeExpiryDate.getHours()+1) 
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:verifyCodeExpiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save()
        }


        }

    } catch (error) {
        console.error("Error registering the user",error)
        return Response.json({
            success:false,
            message:"Error registering the user"
        },
        {
            status:500
        })
    }
}