import React from 'react';
import HeadingResume from './HeadingResume'
import HeadingInformations from './HeadingInformations'
import Skills from './Skills'
import Education from './Education'
import Work from './Work';

function Home() {
  return (
    <div>
    <HeadingResume />
    <div className="container">
      <div className="row">
        <HeadingInformations />
        {/*<Skills />
        <Education />
        <Work />*/}
      </div>
    </div>
    </div>
  );
}

export default Home;
