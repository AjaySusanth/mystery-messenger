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
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected sucessfully")
    } catch (error) {
        console.log("DB failed to connect")
        process.exit(1)        
    }
}

export default dbConnect;