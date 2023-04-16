import Header from '../components/Header'
import Meta from '../components/Meta'
import React from 'react';
import AboutInfo from '../components/AboutInfo'
const About = () => {
  // page content
  const pageTitle = 'About This Site'
  const pageDescription = ''

  return (
    <div>
        
      <Header head={pageTitle} description={pageDescription} />
      <hr />
      <AboutInfo />
    </div>
  )
}

export default About