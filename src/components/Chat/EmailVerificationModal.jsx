import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addEmail } from '../../utils/userAPI';

const EmailVerificationModal = ({ showEmailVerificationModal, setShowEmailVerificationModal }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleVerifyClick = async () => {
    try {
      await addEmail(email);
      setMessage("Verification email sent! Please check your email.");
    } catch (error) {
      setMessage("Error occurred while sending verification email.");
    }
  };

  return (
    <Modal show={showEmailVerificationModal} onHide={() => setShowEmailVerificationModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Email Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>To continue using our service, please verify your email.</p>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
        {message && <p>{message}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleVerifyClick}>
          Verify Email
        </Button>
        <Button variant="secondary" onClick={() => setShowEmailVerificationModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailVerificationModal;
