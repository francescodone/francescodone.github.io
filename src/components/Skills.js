import React from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

function Skills() {
  return (
    <div class="container">
      <div className="row">
        <div className="col-sm-12 top60c top60cSpecial">
          <h2 className="colorized">SKILLS</h2>
        </div>
        <div class="container">
          <div className="row">
            <div className="col-sm-12">
              <div class="container">
                <div className="row">
                  <div className="col-sm-12 skillsDiv shadow">
                    <div className="col-md-6 floatLeft">
                      <p id="skillzResume">
                        <span className="skillzTitle"><p><strong>Programming languages: </ strong></p></span>C++, Java, JavaScript, TypeScript, Game Maker Language, SQL.<br />
                        <span className="skillzTitle"><p><strong>Tech frameworks and tools: </ strong></p></span>Photoshop, ReactJS, Redux, AngularJS, git, npm, NodeJS, jQuery, WordPress, Ethereum Network, Blockchain, REST, Spring, Hibernate, PostgreSQL, Maven, JPA, Flyway, LaTex.<br />
                        <span className="skillzTitle"><p><strong>Other: </ strong></p></span>
                        <a href="https://drive.google.com/open?id=1pqGY49KrAXwDJerIEHg8P0S7TBRwIByH">Fundamentals of Digital Marketing (Google Digital Training)</a> <br />
                        <a href="https://drive.google.com/open?id=1kPHJfxUAQCBEDM59lNO6qY3--H3aV_8h">Fundamentals of User Experience Design (Lacerba.io)</a> <br />
                        <a href="https://drive.google.com/open?id=1B2L_IvY1GhtObjcYrvadd7BV_-ciVIid">Introduction to Design Thinking (Lacerba.io)</a>
                      </p>
                    </div>
                    <div className="col-md-6 floatLeft">
                      <span className="left">Front-End Development</span>
                      <Progress percent={90} />
                      <span className="left top15">Back-End Development</span>
                      <Progress percent={70} />
                      <span className="left top15">Photoshop</span>
                      <Progress percent={75} />
                      <span className="left top15">Desktop Development</span>
                      <Progress percent={65} />
                      <span className="left top15">Web App Development</span>
                      <Progress percent={85} />
                    </div>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
