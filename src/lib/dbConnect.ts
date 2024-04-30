import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number 
}

const connection : ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
   if(connection.isConnected) {
       console.log("Using existing connection");
       return
   } 

   try {
       const db = await mongoose.connect(process.env.MONGODB_URI || "")

       console.log(db.connection)

       connection.isConnected = db?.connections[0].readyState

       console.log("Mongodb connected")

   } catch (error) {
       console.log("Db connection failed")
       process.exit(1)
   }
}