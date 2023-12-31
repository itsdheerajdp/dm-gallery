import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './UserPage.css'
import './UserAccountDetailPage.css'
import {Button} from 'semantic-ui-react';
export default function UserAccountDetailPage() {
    axios.defaults.withCredentials=true;
    const navigate = useNavigate();
    const [userData,setuserData]=useState({});
    const [ErrorMessage,setErrorMessage]=useState("");
    const [Error,setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const logoutHandler = async () => {
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
useEffect(() => {
    const fetchUser = async () => {
        try {
            setError(false);
            const response = await axios.get("https://dm-gallery-backend-api.onrender.com/api/v1/users/current-user-page",{withCredentials:true});
            console.log("Response:",response.data.data);
            setuserData(response.data.data);
        } catch (error) {
            setError(true);
            setErrorMessage("Unauthorised Error Occured!!");
          
        } finally {
            setLoading(false);
        }
    };

    fetchUser();
}, []);

if (loading) {
  return <h1>Loading...</h1>;
}

if (Error) {
  return <div className='ErrorMessage'><h1>{ErrorMessage}</h1></div>;
}

return (
  <div className='userPage' style={{backgroundImage:"linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)"}}>
    <div className="topnav">
    <a className="active" href="#">My Account</a>
    <a href="/userPage">Back</a>
    <a href="#" onClick={logoutHandler}>Logout</a>
    </div>
  
<div className="columns the-header is-marginless">
  <div className="column header-text is-6 is-offset-3 is-12-mobile">
    
  
    <img className="header-background" src={userData.coverImage?(userData.coverImage):"https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq"} id="header-background-id" alt="background-img"/>
  
  </div>
</div>
<div className="column is-12 has-text-centered">
  <img className="profile-picture" src={userData.avatar} alt="profile-picture"/>
</div>
<div className="detailsofUserAccount">
  <div style={{display:"flex" , flexDirection:"row" , margin:"0.5rem"}}> <div style={{fontWeight:"bold" , fontSize:"1.5rem" ,margin:"1rem"}}>Full Name &nbsp;:</div> <div style={{fontSize:"1.5rem",margin:"1rem"}}>{userData.fullName}</div> </div>
  <div style={{display:"flex" , flexDirection:"row" ,margin:"0.5rem"}}> <div style={{fontWeight:"bold" , fontSize:"1.5rem",margin:"1rem"}}>Username &nbsp;:</div> <div style={{fontSize:"1.5rem" ,margin:"1rem"}}>{userData.username}</div> </div>
  <div style={{display:"flex" , flexDirection:"row" , margin:"0.5rem"}}> <div style={{fontWeight:"bold" , fontSize:"1.5rem" ,margin:"1rem"}}>Email &nbsp;:</div> <div style={{fontSize:"1.5rem" ,margin:"1rem"}}>{userData.email}</div> </div>
  <Button style={{ margin:"0.5rem"}} onClick={(event)=>navigate("/users/account-detail/edit-account-detail")} positive>Edit Account Details</Button>
</div>
</div>
 
)
}
