import Header from '../components/Header'
import Meta from '../components/Meta'
import React from 'react';

const About = () => {
  // page content
  const pageTitle = 'About'
  const pageDescription = 'A free essay writer powered by OpenAI.'
  const aboutText = `Welcome to OtisFuse, a revolutionary new tool that helps students like you get a head start on your writing assignments! Our service uses advanced artificial intelligence to take an essay prompt and title, and generate a simple essay that can serve as the foundation for your own work.

  Whether you're struggling to come up with ideas for an essay, or just looking for a way to streamline your writing process, otisfuse.com has you covered. Simply enter your prompt and title, and our AI will do the rest, providing you with a basic essay that you can use as a launching pad for your own ideas.
  
  But here's the best part: using otisfuse.com can save you time and effort in the early stages of the writing process. No more staring at a blank page, wondering where to begin. With our service, you'll have a solid foundation to build upon, freeing you up to focus on the creative and analytical aspects of your writing.
  
  So if you're a student looking to save time and stress on your writing assignments, give otisfuse.com a try today!`

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