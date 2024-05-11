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
       const db = await mongoose.connect(`${process.env.MONGODB_URI}secret` || "")

    //    console.log(db.connection)

       connection.isConnected = db?.connections[0].readyState

       console.log("Mongodb connected")

   } catch (error) {
       console.log("Db connection failed ::" + error)
       process.exit(1)
   }
}