import { Form, Container, Spinner, Button, Toast, Row, Col } from 'react-bootstrap'
import React, { useRef, useState, useEffect } from 'react';

const EssayOutput = ({essayOut}) => {

  const isLoading = essayOut === "Loading..."
  const isGenerated = essayOut !== "Your essay will appear here" && !isLoading;
  const textAreaRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const outputRef = useRef(null);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(textAreaRef.current.value);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const taHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = taHeight + "px";
    }

    if (isGenerated) {
      outputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    
  }, [essayOut]);

  return (
    <div>
      <Container>
        <Row>
        <Col sm={12} md={12} lg={10}>
          <Form.Control as="textarea" value={essayOut} readOnly ref={textAreaRef} />
          <Form.Text className="text-muted">
            This is the essay generated by OpenAI based on your prompt and title.
          </Form.Text>
        </Col>
        <Col sm={12} md={12} lg={2}>
          {isLoading ? (    
          <Spinner animation="border" role="status" />
          ) : (
            <div>
              <Button onClick={handleCopyClick} size='lg'>Copy</Button>
            </div>
          )}
        </Col>
        </Row>
      </Container>
      <Container ref={outputRef} className="my-1">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>Text copied to clipboard</Toast.Body>
        </Toast>
      </Container>
    </div> 
    
  )
  
}

export default EssayOutput;
