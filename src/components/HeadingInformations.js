import React from 'react';
import { FaLinkedin, FaInstagram, FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

function HeadingInformations() {

  function calculateAge(birthday) {
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  let myAge = calculateAge(new Date("05/11/1997"));

  return (
    <div id="info" className="col-sm-12 shadow">
      <div className="col-sm-12 col-md-12 col-lg-5 imgDiv">
        <img id="profilePhoto" alt="Francesco Donè" src="profile.jpg"/>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-7">
        <p id="welcome"><span>Hello & Welcome</span></p>
        <h1 id="im">I'M <span className="colorized">FRANCESCO DONÈ</span></h1>
        <p className="subTitle">Software Engineer</p>
        <hr />
        <div className="col-sm-2">
          <p>
            <strong>Age</strong>
          </p>
        </div>
        <div className="col-sm-10">
          <p>
            <span>{myAge}</span>
          </p>
        </div>
        <div className="col-sm-2">
          <p>
            <strong>Address</strong>
          </p>
        </div>
        <div className="col-sm-10">
          <p>
            <span>San Donà di Piave, VE 30027, Italia</span>
          </p>
        </div>
        <div className="col-sm-2">
          <p>
            <strong>Email</strong>
          </p>
        </div>
        <div className="col-sm-10">
          <p>
            <span>francesco.done.11597@gmail.com</span>
          </p>
        </div>
        <div className="col-sm-2">
          <p>
            <strong>Phone</strong>
          </p>
        </div>
        <div className="col-sm-10">
          <p>
            <span>+39 334 2535957</span>
          </p>
        </div>
        <div className="col-sm-2">
          <p>
            <strong>Website</strong>
          </p>
        </div>
        <div className="col-sm-10">
          <p>
            <span><a href="https://francescodone.github.io">francescodone.github.io</a></span>
          </p>
        </div>
        <div className="headingLinks">
          <div className="col-sm-2 offset-sm-1"><a href="https://github.com/francescodone"><FaGithub /></a></div>
          <div className="col-sm-2"><a href="https://www.linkedin.com/in/francesco-don%C3%A8-43b0a9173/"><FaLinkedin /></a></div>
          <div className="col-sm-2"><a href="https://www.instagram.com/francesco_done/"><FaInstagram /></a></div>
          <div className="col-sm-2"><a href="mailto:francesco.done.11597@gmail.com"><FaGoogle /></a></div>
          <div className="col-sm-2"><a href="https://www.facebook.com/francesco.done"><FaFacebookF /></a></div>
        </div>
      </div>
    </div>
  );
}

export default HeadingInformations;
