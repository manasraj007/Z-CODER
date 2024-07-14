// src/pages/HomePage.js

import React from 'react'; 
import './HomePage.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

//import LoginPage from './LoginPage';


const HomePage = () => {
  //const [showLoginPage, setShowLoginPage] = useState(false);

  // const handleCreateProfileClick = () => {
  //   window.open('/login', '_blank'); // Open login page in a new tab
  // };
  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Level Up Your Coding Skills with ZCoder</h2>
        <p>Collaborate, Learn, and Build Your Coding Community.</p>
         <div className="cta-buttons"> 
           <Link to="/LogIn" className="cta-button">Create a Profile</Link> 
           {/* <button className="cta-button">Explore Challenges</button>  */}
         </div> 
      </div>
      {/* {showLoginPage && <LoginPage />} */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">👤</div>
            <div className="feature-description">Showcase your skills, build your coding identity</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🤝</div>
            <div className="feature-description">Work on coding questions together, get feedback</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📅</div>
            <div className="feature-description">Stay on top of coding contests and events</div>
          </div>
          <div className="feature">
            <div className="feature-icon">💬</div>
            <div className="feature-description">Join themed discussions and code collaboratively</div>
          </div>
          <div className="feature">
            <div className="feature-icon">💻</div>
            <div className="feature-description">Write, test, and debug your code with ease</div>
          </div>
        </div>
      </div>
      <div className="cta-section">
        <h2>Call to Action</h2>
        <button className="cta-button">Get Started Today</button>
      </div>
    </div>
  );
};

export default HomePage;
