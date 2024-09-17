import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected ?: number;
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (connection.isConnected)
    {
        console.log("Db is already connected")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "",{})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected sucessfully")
        Response.json({
            success:true,
            message:"DB connection successfull"
        })
    } catch (error) {
        console.log("DB failed to connect",error)
        Response.json({
            success:false,
            message:"DB connection failed"
        })
        process.exit(1)        
    }
}

export default dbConnect;