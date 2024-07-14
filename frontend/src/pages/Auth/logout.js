import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import { useEffect, useRef } from "react";

const Logout = () => {

    const navigate = useNavigate()
    const params = useParams()
    const userid = params.id
    const isFetchRef = useRef(false)
   
    const handleLogOut = async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , undefined)
            const response = await axios.get(`http://localhost:3001/LogIn/${userid}/LogOut`, {
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`Bearer ${AccessToken}`
                }
            } ,{withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
        }catch(error){
            navigate(-1)
            alert(`Error in Logging Out. ${error.message}`)
        }
    }   

    useEffect(()=>{
        if(!isFetchRef.current){
            isFetchRef.current = true
            handleLogOut()
        }
    },[])

    return (  
        <div className="flex2" style={{height:'100vh'}}>
            <FontAwesomeIcon icon={faCircleCheck} style={{fontSize:'10vh'}}></FontAwesomeIcon>
            <h1>Logged out!</h1>
            <button id="logout-btn"><Link className="link" style={{fontSize:'medium', color:'black'}} to='/'>Return to Home</Link></button>
        </div>
    );
}

export default Logout;