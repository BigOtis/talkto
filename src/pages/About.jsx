import Header from '../components/Header'
import Meta from '../components/Meta'
import React from 'react';

const About = () => {
  // page content
  const pageTitle = 'About'
  const pageDescription = 'About Talk To AI'
  const aboutText = `Welcome to Talk To AI, where you can experience parody conversations with any person known to the internet. Our platform uses advanced AI technology to emulate the personalities of famous individuals through text messaging. Engage in entertaining and amusing discussions with the AI-generated versions of your favorite celebrities, historical figures, and public personalities.

  Legal Disclaimer:
  
  Please note that the characters represented on our website are purely fictional and for parody and humor purposes only. They do not represent the real people they resemble, nor are they endorsed or affiliated with them in any way. Talk To AI is not responsible for any misunderstandings or misinterpretations that may arise from the use of our platform. Our intent is solely to provide entertainment and enjoyment to our users. By using Talk To AI, you acknowledge and agree to these terms.
  
  Enjoy your conversations and have a great time exploring the amusing world of AI-generated personalities!`

  return (
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
      <hr />
      <center>
        {aboutText.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </center>
      <hr />
      <center>
        <p>
          <a href="https://beta.openai.com/docs/usage-policies">
            See the following disclaimer and usage from OpenAI.
          </a>
        </p>
      </center>
      <div className='starter-template text-center mt-5'>
        <p className='lead text-capitalize'>
          <a href="https://store.steampowered.com/search/?publisher=Otis%20Fuse%20Productions">
            Created by Otis Fuse Productions
          </a>
        </p>
      </div>
    </div>
  )
}

export default About