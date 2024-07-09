// src/pages/ProfilePage.js

import React from 'react';
import { useEffect,useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setprofile] = useState(null)
  useEffect(() => {
    const fetchData = async () =>{
      const response = await fetch('http://localhost:3000/api/user')
      const json = await response.json()
      if(response.ok){
        setprofile(json)
      }
    }
    fetchData()
  },[])
  const user = {
    name: profile.fullname,
    username: profile.username,
    platforms: {
      codeforces: {
        username: profile.codeforces
      },
      codechef: {
        username: profile.codechef
      },
      atcoder: {
        username: profile.atcoder
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user.name}</h1>
        <h2>@{user.username}</h2>
      </div>
      <div className="profile-details">
        <h3>Competitive Programming Handle</h3>
        <div className="platforms">
          <div className="platform">
            <h4>Codeforces</h4>
            <p>Username: {user.platforms.codeforces.username}</p>
          </div>
          <div className="platform">
            <h4>CodeChef</h4>
            <p>Username: {user.platforms.codechef.username}</p>
          </div>
          <div className="platform">
            <h4>AtCoder</h4>
            <p>Username: {user.platforms.atcoder.username}</p>
          </div>
          {/* Add more platforms as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
