import React from 'react';

function Education() {
  return (
    <div class="container">
      <div className="row">
        <div className="col-sm-12 top60c">
          <h2 className="colorized">EDUCATION</h2>
          <div class="container">
            <div className="row">
              <div className="col-md-6 col-sm-12 milestone shadow firstEducation leftEducation doubleLine">
                <div class="triangle-right" />
                <div class="circle-right" />
                <h5>High Scool Diploma</h5>
                <h6>ISTITUTO VITO VOLTERRA (SAN DONÀ DI PIAVE)</h6>
                <p id="welcome"><span>2011 - 2016</span></p>
              </div>
              <div className="col-md-6 col-sm-12 milestone shadow firstEducation rightEducation doubleLine padua">
                <div class="triangle-left" />
                <div class="circle-left" />
                <h5>BS in Computer Science</h5> 
                <h6>UNIVERSITY OF PADUA</h6>
                <p id="welcome"><span>2016 - 2019</span></p>
              </div>
              <div className="col-sm-6 milestone shadow leftEducation milan">
                <div class="triangle-right" />
                <div class="circle-right" />
                <h5>Master in Computer Science</h5>
                <h6>UNIVERSITY OF MILAN</h6>
                <p id="welcome"><span>2019 - Present</span></p>
              </div>
              <div className="col-md-6 col-sm-12 milestone shadow rightEducation copenhagen">
                <div class="triangle-left" />
                <div class="circle-left" />
                <h5>Erasmus+</h5> 
                <h6>UNIVERSITY OF COPENHAGEN</h6>
                <p id="welcome"><span>2020 - 2021</span></p>
              </div>
              <div className="col-md-6 col-sm-12 milestone shadow firstEducation leftEducation lastEducation doubleLine future">
                <div class="triangle-right" />
                <div class="circle-right" />
                <h5>░░░░░░░░░░░░░░░</h5> 
                <h6>░░░░░░░░░░░░</h6>
                <p id="welcome"><span>░░░ - ░░░</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
