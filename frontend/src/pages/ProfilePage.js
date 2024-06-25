// src/pages/ProfilePage.js

import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const user = {
    name: "John Doe",
    username: "johndoe123",
    age: 25,
    platforms: {
      codeforces: {
        rating: 2000,
        username: "johndoe_cf"
      },
      codechef: {
        rating: 1800,
        username: "johndoe_cc"
      },
      atcoder: {
        rating: 1900,
        username: "johndoe_ac"
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user.name}</h1>
        <h2>@{user.username}</h2>
        <p>Age: {user.age}</p>
      </div>
      <div className="profile-details">
        <h3>Competitive Programming Ratings</h3>
        <div className="platforms">
          <div className="platform">
            <h4>Codeforces</h4>
            <p>Username: {user.platforms.codeforces.username}</p>
            <p>Rating: {user.platforms.codeforces.rating}</p>
          </div>
          <div className="platform">
            <h4>CodeChef</h4>
            <p>Username: {user.platforms.codechef.username}</p>
            <p>Rating: {user.platforms.codechef.rating}</p>
          </div>
          <div className="platform">
            <h4>AtCoder</h4>
            <p>Username: {user.platforms.atcoder.username}</p>
            <p>Rating: {user.platforms.atcoder.rating}</p>
          </div>
          {/* Add more platforms as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
