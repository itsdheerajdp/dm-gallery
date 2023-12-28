import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button ,Form } from 'semantic-ui-react'

import './UserPage.css'
const UserPage = () => {
    axios.defaults.withCredentials=true;
    const navigate = useNavigate();
    const [ErrorMessage,setErrorMessage]=useState("");
    const [Error,setError] = useState(false);
    const [galleryImages,setgalleryImages]=useState([]);
    const [TitleOfImage,setTitleOfImage] = useState("");
    const [DescriptionOfImage,setDescriptionOfImage]=useState("");
    const [Image,setImage]=useState(null);
    const logoutHandler = async () => {
      try {
          const response = await axios.post('http://localhost:8000/api/v1/users/logout/',{},{withCredentials:true});
          console.log("Successfully Logged Out");
          navigate('/');
          console.log(response);
      } catch (error) {
          console.log("Error During Logging out:", error);
          // Provide user-friendly error message
          alert("Error during logout. Please try again.");
      }
  }
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchUser = async () => {
        try {
            setError(false);
            const response = await axios.get("http://localhost:8000/api/v1/users/current-user-page",{withCredentials:true});
            const galleryimages = await axios.get("http://localhost:8000/api/v1/users/get-gallery-images",{withCredentials:true});
            setgalleryImages(galleryimages.data.data);
            console.log("gallery Images:",galleryimages.data.data);
            console.log("Response:",response.data.data);
        } catch (error) {
            setError(true);
            if(error.response)
            setErrorMessage(error.response.data.message);
            else 
            setErrorMessage("Unauthorised Error Occured !!")
          
        } finally {
            setLoading(false);
        }
    };

    fetchUser();
}, []);

const uploadImageHandler = async (event)=>{
event.preventDefault();
const formData = new FormData();
formData.append("image",Image);
console.log("Image:",Image);
formData.append("title",TitleOfImage);
console.log("Title:",TitleOfImage)
formData.append("description",DescriptionOfImage);
console.log("Description:",DescriptionOfImage);
console.log("form Data:",formData)
try {
  console.log("I am in try");
  const response = await axios.post("http://localhost:8000/api/v1/users/upload-image",formData,{ 
    headers: {
    'Content-Type': 'multipart/form-data',
  },withCredentials:true});
       alert("Image Uploaded Successfully!!");
       console.log(response);
       setImage(null);
       setTitleOfImage("");
       setDescriptionOfImage("");
       window.location.reload();
} catch (error) {
  console.log("Error:",error)
  alert("Error Occured During Uploading of Image in gallery!")
}

}

const deleteImageHandler = async(event,imageId)=>{
  event.preventDefault();
  console.log("Event Target:",imageId)
 try {
  const response = await axios.delete(`http://localhost:8000/api/v1/users/delete-image/${imageId}`);
  console.log("Response:",response);
  window.location.reload();
 } catch (error) {
  console.log("Something Went Wrong During Deletion of Image !!");
 }
}

if (loading) {
  return <h1>Loading...</h1>;
}

if (Error) {
  return <div className='ErrorMessage'><h1>{ErrorMessage}</h1></div>;
}

return (
  <div className='userPage'>
     <div className="topnav">
    <a className="active" href="#">My Gallery</a>
    <a href="/users/account-detail">My Account</a>
    <a href="#" onClick={logoutHandler}>Logout</a>
    {/* <Button onClick={logoutHandler}>Logout</Button> */}
    </div>
      <div className="userPageHeading"><h1>Your Personal Gallery</h1></div>
      <div className="userPageContent">
      <Form className='uploadImageForm'>
     
    <Form.Field>
      <label>Title</label>
      <input placeholder='Enter Title Of Image' value={TitleOfImage} onChange={(event)=>setTitleOfImage(event.target.value)} />
    </Form.Field>
    <Form.Field>
      <label>Description</label>
      <input placeholder='Enter Description Of Image' value={DescriptionOfImage} onChange={(event)=>setDescriptionOfImage(event.target.value)} />
    </Form.Field>
   <Form.Field>
      <label>Chose Image</label>
      <input type='file' accept='image/*' name='image' onChange={(event)=>setImage(event.target.files[0])} />
    </Form.Field>
    <Button positive type='submit' onClick={uploadImageHandler}>Upload Image in Gallery</Button>
  </Form>
      <ul className="cards">
       {
       galleryImages.map((image)=>(
        <li className="cards_item">
        <div className="card">
          <div className="card_image"><img src={image.image}/></div>
          <div className="card_content">
            <h2 className="card_title">{image.title}</h2>
            <p className="card_text">{image.description}</p>
            Uploaded in {new Date(image.createdAt).toLocaleDateString()}
            <div className="deleteButton"><Button negative onClick={(event)=>deleteImageHandler(event,image._id)}>Delete Image From Gallery</Button></div>
          </div>
        </div>
      </li>
     
      
       ))
      }
       </ul>
      </div>
  </div>
);
}
export default UserPage;
