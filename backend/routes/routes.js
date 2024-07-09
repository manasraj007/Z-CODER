import express from 'express'
import{addUser,getUsers} from '../controller/user-controller.js'
const route=express.Router();
route.post('/signup',addUser);
route.post('/login',getUsers);
export default route;
