import Header from '../components/Header'
import Meta from '../components/Meta'
import EssayInput from '../components/EssayInput'
import EssayOutput from '../components/EssayOutput';
import { useState } from 'react';
import Testimonials from '../components/Testimonials';

const Essay = () => {
  // page content
  const pageTitle = 'AI Essay Generator | One Click Essay Writing'
  const pageDescription = 'Streamline Your Essay Writing with OtisFuse - The Advanced AI Tool That Generates a Comprehensive Foundation for Your Assignments, Saving You Time and Stress!'
  const [essayOut, setEssayOut] = useState('Your essay will appear here');
  const isEssayOutput = !(essayOut === 'Your essay will appear here');

  return (
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
      {isEssayOutput && <EssayOutput essayOut={essayOut}/>}
      <EssayInput essayOut={essayOut} setEssay={setEssayOut}/>
      <Testimonials/>
    </div>
  )
}

export default Essay