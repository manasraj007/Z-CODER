import mongoose from 'mongoose'
import { configDotenv } from 'dotenv'
configDotenv();
const URL=process.env.MONGO_URI
const  connection = async () =>{
    try{
         await mongoose.connect(URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
         });
         console.log("we rolling database connected");
    }catch(error){
        console.log(error.message);
    }
}
export default connection;