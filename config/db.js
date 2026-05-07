import mongoose from "mongoose"
import { connect } from "node:http2"


async function connectDB(){
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)

        console.log("Connect DB Successfully....!")
    } catch (error) {
        throw new Error(error.message)
    }
}

export default connectDB