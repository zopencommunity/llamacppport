import React from 'react';
import './Header.css';
import zopenLogo from '../assets/zopen-logo.png';

const Header = () => {
  return (
    <>
      <div className="heading">
        <img src={zopenLogo} alt="Zopen Community Logo" />
        <h1>
          <span style={{ fontWeight: 100 }}>WELCOME TO</span><br />
          <span style={{ fontWeight: 700 }}>ZOPEN CHAT</span>
        </h1>
      </div>

      <div className="intro-paragraph">
        <p>
          Your gateway to the open-source tools available on zopen community! <br />
          Ask questions, and explore tools to get instant help as you build the future of z/OS.
        </p>
      </div>
    </>
  );
};

export default Header;