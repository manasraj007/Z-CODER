import { Link, useParams , useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faCalendar, faCirclePlus, faCircleUser,  faMessage } from '@fortawesome/free-solid-svg-icons'
import {faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from 'react'
import axios from 'axios'




function Navbar2() {
    const params = useParams()
    const userId = params.id
    const [searchWord  , setSearchWord] = useState('')
    const [questionList , setQuestionList]=useState([])
    const [searchResults , setSearchResults] = useState(null)
    const navigate = useNavigate()
    
    
    const handleSearch = async()=>{
        try{
            if(searchWord.trim() === ""){
                setSearchResults('')
                return;
            }
            const AccessToken = localStorage.getItem('AccessToken')
            localStorage.setItem('AccessToken' , AccessToken)
            const response = await axios.post(`https://localhost:3001/LogIn/${userId}/Search?searchWord=${searchWord}`, {},{
                headers:{
                    'authorization':`Bearer ${AccessToken}`
                }
            },{withCredentials:true})
            const data = await response.data
            if(data.questionList === null ){
                return;
            }
            console.log(data.questionList)
            setSearchResults('Search Results')
            setQuestionList(data.questionList)
        }catch(error){
            setSearchResults('No Results')
           setQuestionList(null)
        }
    }

 
    return (<>
        <div className='navbar-wrapper' >
        
        <div className='flex' style={{ gap: '0.1vw', justifyContent: 'flex-start' }}>
        <p className='link' style={{ fontSize: '5vh', width: '10vw'}} ><p id="landingpage-heading" style={{ fontSize: '5vh', width: '10vw' , cursor:"pointer"}} onClick={()=>{navigate(`/LogIn/${userId}`)}}>ZCoder</p></p>
        
        <p className='link' ><FontAwesomeIcon icon={faCalendar} style={{ color: 'black', fontSize: '3vh' }} onClick={()=>{navigate(`/LogIn/${userId}/Calender`)}}/></p>
        <Link className='link' to='/CodeEditor'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ color: 'black', width: '3.2vh' }} class="size-6">
        <path fill-rule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
        </svg>
        
        
        </Link>
        {/* <p className='link' ><FontAwesomeIcon icon={faMessage} style={{ color: 'black', fontSize: '3vh' }} onClick={()=>{navigate(`/LogIn/${userId}/ChatRoom`)}}/></p> */}
        <p className='link' ><FontAwesomeIcon icon={faCirclePlus} style={{ color: 'black', fontSize: '3vh' }} onClick={()=>{navigate(`/LogIn/${userId}/PublishQuestion` , {replace:true})}}/></p>
        </div>
        <div className='search-outer-wrapper' style={{display:"flex", flexDirection:"column"}}>
        <div className="flex" style={{ fontSize: '3vh' ,backgroundColor:'#b7b6b6' ,width: '52vw', height:'5vh', borderRadius:'2vh'}}>
        <input style={{ height: '3vh' , width: '50vw'}} placeholder='search users or questions' onChange={(e)=>{setSearchWord(e.target.value); handleSearch()}}></input>
        <FontAwesomeIcon icon={faMagnifyingGlass}  style={{ padding: '2vh', fontSize: '3vh' }} />
        
        </div>
        <div className='search-result-wrapper' style={{width:"100%"  , height:"max-content" , backgroundColor:"white"}}>
            <div>{searchResults}</div>
        {questionList && questionList.map(question =>{
            return(
                <p onClick={()=>{navigate(`/LogIn/${userId}/${question._id}` , {replace:true})}}>{question.headline}</p>
            )
        })}
        
        </div>
        </div>
        
        <div className='flex' style={{ gap: '0.1vw', justifyContent: 'flex-start' }}>
        <p className='link'> <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: 'black', fontSize: '3vh' }} onClick={()=>{navigate(`/LogIn/${userId}/logout`)}} /> </p>
        <p className='link'> <FontAwesomeIcon icon={faCircleUser} style={{ color: 'black', fontSize: '3vh' }} onClick={()=>{navigate(`/LogIn/${userId}/Profile`)}} /> </p>
        </div>
        </div>
        </>)
    }
    
    export default Navbar2