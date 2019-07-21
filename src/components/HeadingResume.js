import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { FaCloudDownloadAlt } from "react-icons/fa";

function HeadingResume() {
  return (
    <div className="maxWidth">
      <div class="container">
        <div className="row">
          <div className="col-sm-12 top60">
            <div className="col-sm-4 left">
              <h2>FRANCESCO DONÈ</h2>
              <p>Software Engineer</p>
            </div>
            <div className="col-sm-8 right">
            <a className="right" href="https://drive.google.com/open?id=1x6SG6KOd9WgVrwJ1j70KWrhTqoN7b-kG"><AwesomeButton type="primary">Download my resume <FaCloudDownloadAlt /></AwesomeButton></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeadingResume;
