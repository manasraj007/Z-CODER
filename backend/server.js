import express from 'express'
import route from './routes/routes.js'
import cors from 'cors'
import connection from './database/db.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {Server as SocketIO} from 'socket.io'
import { createServer } from 'http'
import Message from './model/message.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
    path:path.resolve(__dirname,'.env')
})
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(cookieParser());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
connection();
app.use('/',route);

app.listen(process.env.PORT,()=>{
    console.log('Server is running on port', process.env.PORT)
});
const server = createServer(app)
const io = new SocketIO( server , {
    cors: {
        origin: '*',
        credentials:true,
        methods: ['GET', 'POST'],
      },
})
io.use((socket , next)=>{
    const authCookie = socket.handshake.headers.cookie
    if(!authCookie){
        return (new Error('No Cookies Sent'))
    }
    const parseCookies = cookie.parse(authCookie)
    const token = parseCookies['AccessToken']
    if(!token){
        return (new Error('NO Access Token sent'))
    }
    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET,(error , user)=>{
        if(!error){
            return (new Error('Invalid Access Token'))
        }
        socket.user = user
        next()
    })
})
io.on('connection' , (socket)=>{
    console.log('A user connected: ', socket.id);

    socket.join(universalRoom);

    socket.emit('joinedRoom', universalRoom);

    socket.to(universalRoom).emit('message', { username: 'system', message: `User ${socket.id} has joined the chat` });

    socket.on('message', async(msg) => {
        try{
            const newMessage = await Message.create({userid:msg.userid , content:msg.message})
            const user = await User.findById(msg.userid)
            const username  = user.username
            io.to(universalRoom).emit('message', { username:username, content:msg.message });
        }catch(error){
            io.to(universalRoom).emit('message' , {username:'system' , message:`${socket.id} tried buts failed to send a message`})
        }
      });

    socket.on('disconnect', () => {
        io.to(universalRoom).emit('message', { username: 'system', message: `User ${socket.id} has left the chat` });
    });
})



