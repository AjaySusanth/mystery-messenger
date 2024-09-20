import mongoose,{Schema,Document} from 'mongoose'

export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[
            /^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address"
        ]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
    },
    verifyCode:{
        type:String,
        required:[true,"Please enter a verify code"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"],
    },
    isVerified:{
        type:Boolean,
        required:[true,"Verification required"],
        default:true
    },
    isAcceptingMessage:{
        type:Boolean,
        required:[true,"Required"],
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;
