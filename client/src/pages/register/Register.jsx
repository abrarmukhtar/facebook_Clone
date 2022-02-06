import React, {useRef, useContext} from 'react'
import "../register/register.css";
import {apiCalls} from '../../apiCalls';
import {AuthContext} from '../../components/context/AuthContext'
import axios from 'axios';
import {useHistory, Link} from 'react-router-dom'
export default function Register() {
    const username = useRef();
    const email = useRef();
    const password=useRef();
    const passwordAgain=useRef();
   const history = useHistory();
    const handleRegister =async (e)=>{

      e.preventDefault();

      if(password.current.value !== passwordAgain.current.value ){
            password.current.setCustomValidity("Password don't matched! ");        
      }else{

        const user ={
          username: username.current.value,
          email: email.current.value,
          password: password.current.value
        }
        try {
            await axios.post('/auth/register', user);
            history.push('/login')
        } catch (error) {
          console.log(error);
          
        }

      }

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
          <form className="loginBox" onSubmit={handleRegister}>
            <input placeholder="Username" className="loginInput" ref={username} type="text" required/>
            <input placeholder="Email" className="loginInput" ref={email} type="email" required/>
            <input placeholder="Password" className="loginInput" ref={password} type="password" minLength="6" required/>
            <input placeholder="Password Again" className="loginInput" ref={passwordAgain} type="password" minLength="6" required/>
            <button className="loginButton"  type="submit">Sign Up</button>
            <button className="loginRegisterButton" >
              <Link to='/login' style={{textDecoration: "none", color: "white"}}> Log into Account </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
