import Navbar2 from "../../components/Navbar2.js";
import { useNavigate , useParams} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";




const Question = () => {

    const navigate = useNavigate()
    const params = useParams()
    const userid = params.id 
    const qid = params.qid
    const isFetchRef = useRef(false)
    const [question , setQuestion] = useState({'headline':"Question Headline", 'name':"username" , "statement":"Question Statement", "code":"demo code annd mand ka tola" , "upvote":99})
    const [isUpVoted , setIsUpVoted]= useState(false)
    const [isBookmarked , setIsBookmarked]= useState(false)


    const handleGetQuestion = async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.get(`http://localhost:3001/LogIn/${userid}/${qid}`,{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            }  , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            setQuestion(data.data)
            setIsBookmarked(data.isBookmarked)
            setIsUpVoted(data.isUpVoted)
        }catch(error){
            alert("Error in fetching data")
            navigate(-1)
        }
    }
    useEffect(()=>{
        if(!isFetchRef.current){
            isFetchRef.current=true
            handleGetQuestion()
        }
    })
    
    const handlePostBookmark = async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userid}/${qid}/Bookmark`,{},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            }  , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            handleGetQuestion()
        }catch(error){
            alert("Error in Bookmarking the question." , error.message);
        }
    }


    const handlePostUpVote =async()=>{
        try{
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userid}/${qid}/Question-UpVote`,{},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            } , {withCredentials:true})
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            handleGetQuestion()
        }catch(error){
            alert('Error in UpVoting the question' , error.message)
        }
    }

    return (
        <div className='body-wrapper'>

            <Navbar2 />
            <div className="flex" style={{ justifyContent: 'space-between', width: '94vw' }}>
                <p>{question.name}</p>
               
            </div>
            <div className="flex2" style={{ width: '95vw', alignItems: 'flex-start', rowGap: '2vh' }}>
                <p class="heading" style={{ fontSize: '4vh' }}>{question.headline}</p>
                <div className="search-results">
                    <p>{question.statement}</p>
                </div>
                <div className="code-result-wrapper" style={{height:'max-content', width:'92vw', borderRadius:'2vh' , padding:'3vh' , backgroundColor:"rgb(20 , 0,20)" , color:'white'}}>{question.code}</div>
                {/* we do not need an editor over here... only the code fetched from the backend will displayed here... code will not be written */}
                

            </div>
            <div className="flex" style={{ justifyContent: 'space-between', width: '94vw', height: '7vh' }}>
                <div className="flex" style={{ gap: '1vw' }}>
                    <FontAwesomeIcon icon={faBookmark} onClick={handlePostBookmark} style={{ fontSize: '3vh' , color:isBookmarked?'green':'black'}} />
                    <FontAwesomeIcon icon={faThumbsUp} onClick={handlePostUpVote} style={{ fontSize: '3vh' , color:isUpVoted?'green':'black' }} />{question.upvote}
                </div>
                <div className="flex" style={{ gap: '1vw' }}>
                    <button style={{backgroundColor:'rgb(100 , 100 , 100)' , color:'white'}} className="comment-btn" onClick={()=>{navigate(`Comments`)}}>See Comments</button>
                    {/* <button className="comment-btn">Add Comment</button> */}
                </div>
            </div>
        </div>
    );
}

export default Question;