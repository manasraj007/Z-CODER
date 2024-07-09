import axios from 'axios';
const url = 'http://localhost:3002';
export const addUser=async(data)=> {
    try{
        await axios.post(`${url}/signup`,data);
    }catch(error){
        console.log('here we have got the error',error.message)
    }
    };
    
export const getUsers=async(data) => {
        try {
            await axios.post(`${url}/login`,data);
        } catch (error) {
            console.log('error fetching data from getUsers api ',error.message)
        }
    
    };
export const userData=async(id)=>{
    try{
        await axios.get(`${url}/data`,id);

    }catch(error){
        console.log('error fetching data from userData api ',error.message)
    }
}

