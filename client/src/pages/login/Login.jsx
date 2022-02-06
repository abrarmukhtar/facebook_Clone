import React,{useRef, useContext} from 'react';
import "../login/login.css";
import {loginCall} from '../../apiCalls';
import {AuthContext} from '../../components/context/AuthContext'
import {CircularProgress} from '@material-ui/core'

export default function Login() {
const email = useRef();
const password = useRef();
const { isFetching,  dispatch} = useContext(AuthContext)

const handleLogin =(e)=>{
  e.preventDefault();
  loginCall({email: email.current.value , password:password.current.value},dispatch )
    
  }
  
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={ handleLogin}>
            <input placeholder="Email" type="email" required ref={email} className="loginInput" />
            <input placeholder="Password" type="password" required ref={password} className="loginInput" />
            <button className="loginButton" type="submit" disabled={isFetching}>
            
            {isFetching ? <CircularProgress color="white" size="20px" /> : "Log In"}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" disabled={isFetching}>
            {isFetching ? <CircularProgress color="primary" size="20px" /> : "Create a New Account"}

            
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
