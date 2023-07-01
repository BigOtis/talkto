import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { registerEmail } from '../../utils/userAPI';

const EmailModal = ({ showEmailModal, setShowEmailModal }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(e.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid && email !== '') {
      await registerEmail(email);
      localStorage.setItem('userEmail', email);
      setEmail('');
      setShowEmailModal(false);
    } else {
      setIsValid(false);
    }
  };

  return (
    <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Stay updated with OtisFuse AI!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Why subscribe?</h5>
        <ul>
          <li>Be the first to know about new features</li>
          <li>Get updates about OtisFuse AI services</li>
          <li>Never miss out when API tokens are replenished</li>
        </ul>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={handleInputChange} 
              isValid={email !== '' && isValid} 
              isInvalid={email !== '' && !isValid} 
              required 
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <hr></hr>
          <Button variant="primary" type="submit">Register</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailModal;
