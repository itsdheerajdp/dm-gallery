import React from 'react'
import './HomePage.css'
import './UserPage.css'
const HomePage = () => {
  return (
    <div>
        <div className="topnav">
    <a className="active" href="#">DM Gallery</a>
    <a href="/login">Login</a>
    <a href="/signup">SignUp</a>
    {/* <Button onClick={logoutHandler}>Logout</Button> */}
    </div>
    <div className="homepage-container">
      <div className="hero-section">
        <h1 className="hero-text">Welcome to Your Creative Space</h1>
        <p className="subtitle">Explore the joy of showcasing your Memories</p>
      
      </div>

      <div className="benefits-section">
        <h2 className="section-title">Key Benefits</h2>
        <div className="benefit">
          <h3>Create Your Gallery</h3>
          <p>Personalize your space with your favorite moments.</p>
        </div>
        <div className="benefit">
          <h3>Upload & Organize</h3>
          <p>Easily upload and organize your photos in a few clicks.</p>
        </div>
        <div className="benefit">
          <h3>Delete or Update</h3>
          <p>Have control over your gallery - delete or update as you wish.</p>
        </div>
      </div>

      <div className="gallery-section">
        <h2 className="section-title">Explore Your Gallery</h2>
        <p>Discover the beauty of your memories with our interactive gallery.</p>
        {/* Add gallery components or additional content here */}
      </div>

   

      <div className="footer-section">
        <p>Enjoy our website on any device! Our responsive design ensures a seamless experience, whether you're on your computer, tablet, or smartphone.</p>
      </div>
    </div>
    </div>
  )
}

export default HomePage
