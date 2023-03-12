import { Form, Button, Container } from 'react-bootstrap'
import { saveEssay } from '../utils/essayStorage';

const EssayInput = ({essayOut, setEssay}) => {

  const submitEssay = async (event) => {
    event.preventDefault();
      
    const form = event.target;
    const title = form.elements.title.value;
    const prompt = form.elements.prompt.value;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const requestCount = localStorage.getItem(date);

    console.log(date);
    console.log(requestCount);
    setEssay("Loading...");

    if(requestCount > 5){
      setEssay("You've reached your daily limit of 5 essays. Please try again tomorrow. Here is a dog video for you to watch in the meantime: https://www.youtube.com/watch?v=X_IMPTYyIqs");
      return;
    }

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, prompt }),
    });
  
    const data = await response.json();
    setEssay(data.essay);
    saveEssay(title, prompt, data.essay);

    if(requestCount){
      localStorage.setItem(date, parseInt(requestCount) + 1);
    }
    else{
      localStorage.setItem(date, 1);
    }
  }

  return (
    <Container>
      <Form  onSubmit={submitEssay}>
        <Form.Group className="mb-3" controlId="essay.ControlTextarea1">
          <Form.Label>Essay Title</Form.Label>
          <Form.Control name="title" as="textarea" rows={1} maxlength="225"/>
          <Form.Text className="text-muted">
            A short title for your essay. This will help the generated essay be unique.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="essay.ControlTextarea2">
          <Form.Label>Prompt</Form.Label>
          <Form.Control name="prompt" as="textarea" rows={5} maxlength="1000"/>
          <Form.Text className="text-muted">
            The prompt this essay should be written for. Up to 1000 letters.
          </Form.Text>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" size='lg'>
            Create Essay
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default EssayInput;
