import axios from "axios"
import { useEffect, useState  , useRef} from "react"
import { useNavigate, useParams } from "react-router-dom"

const AccVerify=()=>{
    const navigate = useNavigate()
    const params = useParams()
    const userid = params.id
    const hasFetchedRef = useRef(false);
    const [otp , setOtp ]=useState('')

    const handleGetOTP=async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.get(`http://localhost:3001/LogIn/${userid}/Profile/AccVerify` ,{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            }  , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            alert("The OTP has been sent to your Registered Email ID. It is valid for 15minutes. Do not make any otp Request for next 15minutes")    
        }catch(error){
            alert("some error occured\n" , error.message)
        } 
    }
    useEffect(() => {
        if (!hasFetchedRef.current) {
            handleGetOTP();
            hasFetchedRef.current = true;
        }
    }, []);

    const handlePostOTP = async()=>{
        if(otp.trim()===""){
            alert("Enter OTP first")
            return;
        }
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userid}/Profile/AccVerify` , {otp},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            }   , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            alert('Email Verification Successfully')
            navigate(-1)
        }catch(error){
            alert("Error Occured\n" , error.message)
        }
    }
    return(
        <div style={{display:'flex' , justifyContent:'center' , alignItems:'center'}}>
        <div className="login-form-wrapper"  style={{}}>
            <form onSubmit={(e)=>{
                e.preventDefault()
                handlePostOTP()
            }} style={{display:'flex' , flexDirection:'column' }}>
            <input type="text" placeholder="Enter your 4-Digit OTP" onChange={(e)=>{setOtp(e.target.value)}} />
            <input type="submit" value="Submit OTP"/>
            </form>
        </div>
        </div>
    )
}

export default AccVerify