import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import "./LoginPage.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
axios.defaults.withCredentials=true;
const navigate = useNavigate();
const [username,setusername]=useState("");
const [password,setpassword]=useState("");
const submitHandler = async(event)=>{
  event.preventDefault();
  console.log("Username:",username);
  console.log("Password:",password);
  try {
    console.log("I am in try");
    const response =await axios.post('https://dm-gallery-backend-api.onrender.com/api/v1/users/login/', { // make sure to use "/" at last of the url
      username: username,
      password: password,
    },{withCredentials:true});
    console.log("Logged In with password",password);
    if(response.status==200)
    navigate('/userPage');

  } catch (error) {
    console.log("I am in Catch",error);
    alert(error.response.data.message);
  }
  setusername("");
  setpassword("");
}
  return (
   <div className='loginFormDiv'>
    <div className="loginHeading">
      <h1>Login To Your Account</h1>
    </div>
     <Form className='loginForm'>
    <Form.Field>
      <label>Username</label>
      <input placeholder='Username' style={{height:"3rem",border:"1px solid black"}} value={username} onChange={(event)=>setusername(event.target.value)}/>
    </Form.Field>
    <Form.Input label='Enter Password' value={password} type='password' style={{height:"3rem",border:"1px solid black",borderRadius:"6px"}} onChange={(event)=>setpassword(event.target.value)}/>
    <Button type='submit' id='loginButton' onClick={submitHandler} >Login</Button>
    <div className='signUpDiv' >
      New to Us  ? &nbsp;<a href="/signup"> SignUp</a>
    </div>
  </Form>
   </div>
  )
}

export default LoginPage
