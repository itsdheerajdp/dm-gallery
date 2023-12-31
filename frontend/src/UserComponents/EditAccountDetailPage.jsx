import React, { useState } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPage.css'
import './EditAccountDetailPage.css'
export default function EditAccountDetailPage() {
  axios.defaults.withCredentials=true;
  const [ErrorMessage,setErrorMessage]=useState("");
  const [Error,setError] = useState(false);
    const navigate = useNavigate();
    const [userData,setuserData] = useState({});
    const [fullname,setfullname] =useState("");
    const [email,setemail] = useState("");
    const [newavatar,setnewavatar] = useState(null);
    const [newcoverImage,setnewcoverImage] = useState(null);
    const [oldpassword,setoldpassword] = useState("");
    const [newpassword,setnewpassword] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            try {
              setError(false)
                const response = await axios.get("https://dm-gallery-backend-api.onrender.com/api/v1/users/current-user-page",{withCredentials:true});
                console.log("Response In Page:",response.data.data);
                setuserData(response.data.data);
                setfullname(response.data.data.fullName);
                setemail(response.data.data.email)
                
            } catch (error) {
                setError(true)
                setErrorMessage("User Not Found")
            } 
        };
       
        fetchUser();
      
    },[]);
 
    const logoutHandler = async (event) => {
      event.preventDefault();
        try {
            const response = await axios.post('https://dm-gallery-backend-api.onrender.com/api/v1/users/logout/',{},{withCredentials:true});
            console.log("Successfully Logged Out");
            navigate('/');
            console.log(response);
        } catch (error) {
            console.log("Error During Logging out:", error);
            // Provide user-friendly error message
            alert("Error during logout. Please try again.");
            
        }
    }
  
  const submitHandler = async(event)=>{
    event.preventDefault();
    try {
        setError(false)
        const response = await axios.post(`https://dm-gallery-backend-api.onrender.com/api/v1/users/update-account-details/${userData._id}`,{
            fullName:fullname,
            email:email
        },{withCredentials:true})
        alert("Details Saved")
        navigate('/users/account-detail');
        console.log("Response after saving Details:",response)
    } catch (error) {
       
        alert("Error During Updating Information.Please try again!  ")
        console.log("Error",error);
    }
    // alert(`Full Name : ${fullname} \nEmail Id :${email} \nChanged Information `);
  }

const submitAvatarHandler = async (event)=>{
event.preventDefault();
try {
    setError(false)
    const formData = new FormData();
    formData.append("avatar",newavatar);
    const response = await axios.post(`https://dm-gallery-backend-api.onrender.com/api/v1/users/update-avatar/${userData._id}`,formData,{withCredentials:true});
    console.log("Response:",response);
    
    alert("Avatar Image Uploaded Successfully")
    navigate('/users/account-detail');
} catch (error) {
    alert("Error Occured While Editing Avatar Image !!")
    console.log("Error:",error);
}
  }

  const submitCoverImageHandler = async (event)=>{
    event.preventDefault();
    try {
      setError(false)
        const formData = new FormData();
        formData.append("coverImage",newcoverImage);
        const response = await axios.post(`https://dm-gallery-backend-api.onrender.com/api/v1/users/update-coverImage/${userData._id}`,formData,{withCredentials:true});
        console.log("Response:",response);
        alert("Cover Image Uploaded Successfully")
        navigate('/users/account-detail');
        

    } catch (error) {
        alert("Error Occured While Updating Cover Image !!")
        console.log("Error:",error);
    }
      }

const submitPasswordChangeHandler = async(event) =>{
event.preventDefault();
try {
    setError(false)
    const response = await axios.post(`https://dm-gallery-backend-api.onrender.com/api/v1/users/change-password/${userData._id}`,{
        oldPassword:oldpassword,
        newPassword:newpassword
    },{withCredentials:true});
    console.log("Password Updated Succesfully")
    alert("Password Updated Successfully!")
    navigate('/users/account-detail');
} catch (error) {
   
    alert("Error Occured During Changing password");
}
}


if (Error) {
  return <div className='ErrorMessage'><h1>{ErrorMessage}</h1></div>;
}
else
  return (
    <div className='editAccountDetailPage'>
     <div className="topnav">
    <a className="active" href="/userPage">My Gallery</a>
    <a href="/users/account-detail">Back</a>
    <a href="#" onClick={logoutHandler}>Logout</a>
    </div>

      <div className="editAccountDetailsClass">
        <div className="editfield">
      <Form>
    <Form.Field>
      <label>Full Name</label>
      <input placeholder='Enter New Full Name' value={fullname} onChange={(event)=>setfullname(event.target.value)}/>
      
    </Form.Field>
    <Form.Field>
      <label>Email</label>
      <input placeholder='Enter New Email' value={email} onChange={(event)=>setemail(event.target.value)}/>
      
    </Form.Field>
    <Button style={{width:"100%"}} type='submit' positive onClick={submitHandler}>Update Full Name and Email </Button>
  </Form>
      </div>
      <div className="editfield">
      <Form>
    <Form.Field>
      <label>Upload New Avatar Image</label>
      <input type='file' accept='image/*' onChange={(event)=>setnewavatar(event.target.files[0])} />
    </Form.Field>
    <Button style={{width:"100%"}} type='submit' positive onClick={submitAvatarHandler}>Update Avatar Image </Button>
  </Form>
      </div>
      <div className="editfield">
      <Form>
    <Form.Field>
      <label>Upload New Cover Image</label>
      <input type='file' accept='image/*' onChange={(event)=>setnewcoverImage(event.target.files[0])} />
    </Form.Field>
    <Button style={{width:"100%"}} type='submit' positive onClick={submitCoverImageHandler}>Update Cover Image </Button>
  </Form>
      </div>
      <div className="editfield">
      <Form>
    <Form.Field>
      <label>Current Password</label>
      <input placeholder='Enter Current Password' onChange={(event)=>setoldpassword(event.target.value)}/>
      
    </Form.Field>
    <Form.Field>
      <label>New Password</label>
      <input placeholder='Enter New Password' onChange={(event)=>setnewpassword(event.target.value)}/>
      
    </Form.Field>
    <Button style={{width:"100%"}} type='submit' positive onClick={submitPasswordChangeHandler}>Update Current Password</Button>
  </Form>
      </div>
      </div>
    </div>
  )
}
