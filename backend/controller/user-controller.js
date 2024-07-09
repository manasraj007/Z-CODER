import {response} from "express";
import User from "../model/user.js"
export const addUser = async (req,res)=>{
    const email = req.body.email
    const codeforces=req.body.codeforces
    const codechef=req.body.codechef
    const atcoder=req.body.codechef
    const username=req.body.newusername
    const password=req.body.newpassword
    try{
        const check = await User.findOne({username:username})
        if(check){
            res.json("exist")
        }else{
            User.create({username,password,email,codeforces,codechef,atcoder})
            res.json("noexist")
            
        }
    }
    catch(e)
    {
        res.json("error")
    }


}
export const getUsers=async(req,res) => {
    const username=req.body.username
    const password=req.body.password
    try{
        const check = await User.findOne({username:username})
        if(check){
            const user=check;
            const passwordcheck=user.password===password
            if(passwordcheck){
                res.json("exist")
            }else{
                res.json("wrong password")
            }
        }else{
            res.json("notexist")
        }
    }
    catch(e)
    {
        res.json("notexist")
    }
    
    

}

