import express from 'express'
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import route from './routes/routes.js'
import cors from 'cors'
import connection from './database/db.js'
import dotenv from 'dotenv'
dotenv.config();
const app=express();
app.use(cors());
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
connection();
app.use('/',route);

app.listen(process.env.PORT,()=>{
    console.log('Server is running on port', process.env.PORT)
});





