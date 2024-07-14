import Navbar2 from "../../components/Navbar2";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faCommentDots , faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import axios from "axios";
import { Editor } from "@monaco-editor/react";
import {  useNavigate, useParams } from "react-router-dom";

const Comments = () => {
    const [comment, setComment] = useState("");
    const [code , setCode] = useState('');
    const [comments, setComments] = useState([]);
    const [headline, setHeadline] = useState("Question Headline");
    const hasFetchRef = useRef(false)
    const navigate =  useNavigate()
    const params = useParams();
    const userId = params.id;
    const questionId = params.qid;
    
    useEffect(() => {
        if(!hasFetchRef.current){
            hasFetchRef.current = true
            fetchData();
        }
    });
    
    const fetchData = async () => {
        try {
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.get(`http://localhost:3001/LogIn/${userId}/${questionId}/Comment` ,{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            } , {withCredentials:true});
            const responseData = await response.data
            if(responseData.error){
                throw new Error(responseData.message)
            }
            setComments(responseData.data.comments);
            setHeadline(responseData.data.headline);
        } catch (error) {
            alert(`Network issues! ${error.message}`)
            navigate(`/LogIn/${userId}/${questionId}` , {replace:true})
        }
    };
    
    const handleUpVote = async (cid) => {
        try {
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response =  await axios.post(`http://localhost:3001/LogIn/${userId}/${questionId}/Comment/${cid}/Comment-UpVote`,{},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            }  , {withCredentials:true});
            const data = await response.data
            if(data.error){
                throw new Error(data.message)
            }
            
            fetchData()
        } catch (error) {
            console.error("Error upvoting comment:", error);
        }
    };
    
    const handleSubmit = async () => {
        
        try {
            if(comment.trim()===''){
                alert('Comment is empty')
                return;
            }
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`http://localhost:3001/LogIn/${userId}/${questionId}/Post-Comment`, 
                { text:comment ,  code:code||''} ,{
                    headers:{
                        'authorization':`Bearer ${AccessToken}`
                    }
                }  , {withCredentials:true} );
                const data = await response.data
                if(data.error){
                    throw new Error(data.message)
                }
                fetchData()
                setComment("");
                setCode("")
            } catch (error) {
                alert(`Error in adding a comment! \n${error.message}`)
            }
        };
        
        const handleDelComment = async (cid)=>{
            try{
                const AccessToken = localStorage.getItem('AccessToken')
                localStorage.setItem('AccessToken' , AccessToken)
                const response = await axios.delete(
                    `http://localhost:3001/LogIn/${userId}/${questionId}/Del-Comment/${cid}`,
                    { headers: {
                        'authorization': `Bearer ${AccessToken}`
                    },
                    withCredentials: true})
                    const data = await response.data
                    if(data.error){
                        throw new Error(data.message)
                    }
                    fetchData()
                }catch(error){
                    alert(`Error! ${error.message}`)
                }
            }
            
            return (
                <>
                <Navbar2 />
                <div className="body-wrapper" style={{ alignItems: 'flex-start', paddingLeft: '4vh' }}>
                <p className="heading" style={{ fontSize: '4vh' }}>{headline}</p>
                
                <div className="comment-wrapper" style={{overflowY:'scroll'}}>
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                    
                    <p>{comment.username}</p>
                    <p className="comment-text" style={{color:comment.userid===userId?'white':'black' , backgroundColor:comment.userid===userId?'black':'white' }}>{comment.text}</p>
                    <div className="code-result-wrapper" style={{height:'max-content',  marginTop:'10px', width:'max-content', borderRadius:'2vh' , padding:'3vh' , backgroundColor:"rgb(20 , 0,20)" , color:'white'}}>{comment.code}</div>
                    
                    <div className="flex" style={{ fontSize: '2vh', paddingLeft: '0.5vw' , marginTop:'5px', justifyContent:'left' }}>
                    
                    <div style={{display:"flex" , alignItems:'center'}}>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleUpVote(comment._id)} style={{ cursor: 'pointer' }} />
                    <p>{comment.upvote}</p>
                    </div>
                    
                    {comment.userid===userId && <FontAwesomeIcon icon={faTrash} style={{color:'red' , fontSize:'2vh' , marginLeft:'80px'}} onClick={()=>{
                        const test = prompt('Enter yes to confirm delete')
                        if(test === 'yes'){
                            handleDelComment(comment._id)
                        }
                    }}/>}
                    
                    </div>
                    </div>
                ))}
                </div>
                
                <div className="comment-footer flex" style={{ gap: '1vw' }}>
                <form className="flex" style={{ gap: '1vw' , flexDirection:'column'}} onSubmit={(e)=>{
                    e.preventDefault()
                    handleSubmit()
                }}>
                
                <div style={{ gap: '1vw'}}  className="flex"> 
                <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: '3vh' }} />
                <input type="text" placeholder="Type in your comment..." style={{ width: '85vw', fontSize: '2vh', height: '2vh' }} value={comment} onChange={(e) => setComment(e.target.value)} required/>
                <button type="submit" style={{ width: '2vw', background: 'none', border: 'none', cursor: 'pointer' }}><FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '3vh' }} /></button>
                </div>
                
                <Editor height='10vh' borderRadius='20px' theme='vs-dark' defaultValue='' onChange={e => {setCode(e)}} />
                </form>
                </div>
                
                </div>
                </>
            );
        }
        
        export default Comments;
        