import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [mode, setMode] = useState('login');
    const navigate = useNavigate();

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
    };

    const handleForgotPassword = () => {
        alert('Forgot password functionality will be implemented here.');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Form submitted in ${mode} mode`);
        navigate('/home');
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
                            <Input type="text" id="username" label="User Name" />
                            <Input type="password" id="password" label="Password" />
                        </div>
                        <div className="form-group form-group--signup">
                            <Input type="text" id="fullname" label="Full Name" />
                            <Input type="email" id="email" label="Email" />
                            <Input type="password" id="createpassword" label="Password" />
                            <Input type="text" id="codeforcesid" label="CodeForces ID"/>
                            <Input type="text" id="codechefid" label="CodeChef ID"/>
                            <Input type="text" id="atcoderid" label="AtCoder ID"/>

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

const Input = ({ id, type, label }) => (
    <input className="form-group__input" type={type} id={id} placeholder={label} />
);

export default LoginPage;
