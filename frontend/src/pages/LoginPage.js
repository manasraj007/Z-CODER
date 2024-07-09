import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { addUser,getUsers } from '../service/api';
import axios from 'axios'

const LoginPage = () => {
    const history=useNavigate();
    const [mode, setMode] = useState('signup');
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [codeforces, setCodeforces] = useState();
    const [codechef, setCodechef] = useState();
    const [atcoder, setAtcoder] = useState();
    const [newusername,setnewUsername] = useState();
    const [newpassword,setnewPassword] = useState();

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
    };

    const handleForgotPassword = () => {
        alert('Forgot password functionality will be implemented here.');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //alert(`Form submitted in ${mode} mode`);
        
        try{
            if(mode==='login'){
                //await getUsers({username,password})
                axios.post('http://localhost:3002/login',{username,password})
                .then(res=>{
                    if(res.data==="exist"){
                        history("/home")
                    }
                    else if(res.data==="notexist"){
                        alert("wrong username or user doesn't exist")
                    }
                    else if(res.data==="wrong password"){
                        alert("Wrong password")
                    }
                })
                .catch(e=>{
                    alert("wrong details")
                    console.log(e);
                })
            }else if(mode==='signup'){
                //await addUser({newusername,newpassword,codechef,codeforces,atcoder,email})
                //alert(newusername)
                axios.post('http://localhost:3002/signup',{newusername,newpassword,codechef,codeforces,atcoder,email})
                .then(res=>{
                    if(res.data==="exist"){
                        alert("User already exist")
                    }
                    else if(res.data==="notexist"){
                        //alert("Sign Up completed")
                        history('/home')
                    }
                })
                .catch(e=>{
                    alert("wrong details given")
                    console.log(e);
                })
            }

            
        }
        catch(e){
            console.log(e);
        }
    };

    return (
        <div className={`app app--is-${mode}`}>
            <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
            <section className={`form-block form-block--is-${mode}`}>
                <header className="form-block__header">
                    <h1>{mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
                    <div className="form-block__toggle-block">
                        <span>{mode === 'login' ? "Don't" : 'Already'} have an account? Click here &#8594;</span>
                        <input id="form-toggler" type="checkbox" onClick={toggleMode} />
                        <label htmlFor="form-toggler"></label>
                    </div>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="form-block__input-wrapper">
                        <div className="form-group form-group--login">
                            <Input type="text" onChange={(e)=>{setUsername(e.target.value)}} id="username" label="User Name" />
                            <Input type="password" onChange={(e)=>{setPassword(e.target.value)}}id="password" label="Password" />
                        </div>
                        <div className="form-group form-group--signup">
                            <Input type="text"  onChange={(e)=> setnewUsername(e.target.value)} id="username" label="User name" />
                            <Input type="email" onChange={(e)=>setEmail(e.target.value)}  id="email" label="Email" />
                            <Input type="password" onChange={(e)=>setnewPassword(e.target.value)} id="createpassword" label="Password" />
                            <Input type="text" onChange={(e)=>setCodeforces(e.target.value)} id="codeforcesid" label="CodeForces ID"/>
                            <Input type="text" onChange={(e)=>setCodechef(e.target.value)} id="codechefid" label="CodeChef ID"/>
                            <Input type="text" onChange={(e)=>setAtcoder(e.target.value)}  id="atcoderid" label="AtCoder ID"/>

                        </div>
                    </div>
                    <button className="button button--primary full-width" type="submit">
                        {mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>
                {mode === 'login' && (
                    <div className="form-block__footer">
                        <button className="button button--link" onClick={handleForgotPassword}>
                            Forgot Password?
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

const Input = ({ id, type, label, onChange }) => (
    <input className="form-group__input" type={type} id={id} placeholder={label} onChange={onChange} />
);

export default LoginPage;
