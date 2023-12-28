import React, { useState } from 'react'
import { Form, Input, TextArea, Button, Select } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import './SignUpPage.css'
import axios from 'axios'
const SignUpPage = () => {
  const navigate = useNavigate();
  const [username,setusername]=useState("");
  const [fullName,setfullName]=useState("");
  const [password,setpassword]=useState("");
  const [email,setemail]=useState("");
  const [avatar,setavatar]=useState(null);
  const [coverImage,setcoverImage]=useState(null);
  const submitHandler = async(event)=>{
      axios.defaults.withCredentials=true
      event.preventDefault();
      const formData = new FormData();
      formData.append('username', username);
      formData.append('fullName', fullName);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('avatar', avatar); // Assuming avatar is a File object
      formData.append('coverImage', coverImage); // Assuming coverImage is a File object
      console.log("Requested Data:",formData)
      try{
       const response = await axios.post("http://localhost:8000/api/v1/users/register",formData,{withCredentials:true});
       console.log("Signed Up Successfully!!");
       console.log(response);
       setusername("");
       setemail("");
       setpassword("");
       setavatar(null);
       setcoverImage(null);
       setfullName("");
      navigate('/login');
      
    } catch (error) {
      alert(error.response.data.message);
    }
    
  }
  return (
    <div className='signUpFormDiv'>
     <div className='signUpHeading'><h1>Create New Account !!</h1></div>
       <Form className='signUpForm' encType="multipart/form-data">
    <Form.Group widths='equal'>
    <Form.Field
        id='form-input-control-last-name'
        control={Input}
        label='Username'
        placeholder='Enter a Unique  Username'
        value={username}
        onChange={(event)=>setusername(event.target.value)}
        required={true}
      />
      <Form.Field
        id='form-input-control-first-name'
        control={Input}
        label='Full name'
        placeholder='Enter Your Full Name'
        value={fullName}
        onChange={(event)=>setfullName(event.target.value)}
        required={true}
      />
     
    
    </Form.Group>
    
    <Form.Field
        id='form-input-control-password'
        control={Input}
        label='Password'
        placeholder='Enter a Strong Password'
        value={password}
        onChange ={(event)=>setpassword(event.target.value)}
        required={true}
      />
    <Form.Field
      id='form-input-control-error-email'
      control={Input}
      // label='Email'
      placeholder='joe@schmoe.com'
      error={{
        content: 'Please enter a valid email address',
        pointing: 'below',
      }}
      required={true}
      value={email}
      onChange={(event)=>setemail(event.target.value)}
    />


  <div className='avatarDiv' style={{marginTop:"1rem"}}><label htmlFor="avatar">Chose Avatar Image</label>
  <input type="file" name='avatar' id='avatar'   accept="image/*" className='Avatar'  onChange={(event)=>setavatar(event.target.files[0])} required/></div>
  
  <div className="coverImageDiv" style={{marginTop:"1rem"}}><label htmlFor="coverImage">Chose cover Image</label>
  <input type="file" name='coverImage'  id='coverImage' accept="image/*"  onChange={(event)=>setcoverImage(event.target.files[0])} /></div>

  <Button type='submit' id='signUpButton' style={{marginTop:"2rem"}} onClick={submitHandler}>Sign Up</Button>

  
  </Form>
  <div className='loginDiv'>
      Already Have an Account ? &nbsp;<a href="/login"> Login</a>
    </div>
    </div>
  )
}

export default SignUpPage
