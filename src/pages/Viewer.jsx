import Header from '../components/Header'
import Meta from '../components/Meta'
import EssayViewer from '../components/EssayViewer'

const Essay = () => {
  // page content
  const pageTitle = 'Essay Viewer';
  const pageDescription = 'Your Essay History';

  return (
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
      <EssayViewer/>
    </div>
  )
}

export default Essay