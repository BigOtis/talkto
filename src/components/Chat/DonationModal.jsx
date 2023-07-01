import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormCheck } from 'react-bootstrap';

const DonationsModal = ({ showDonationModal, setShowDonationModal }) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem('donationModalDoNotShowAgain');
    setDoNotShowAgain(value === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('donationModalDoNotShowAgain', doNotShowAgain);
  }, [doNotShowAgain]);

  const handleClose = () => {
    setShowDonationModal(false);
  };

  if (doNotShowAgain) {
    return null;
  }

  return (
    <Modal show={showDonationModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Support OtisFuse Chat!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Your support helps us:</h5>
        <ul>
          <li>Keep OtisFuse chat running</li>
          <li>Provide a fun, ad-free service</li>
          <li>Maintain and improve the site</li>
        </ul>
        <h5>Suggested donation amounts: $5, $10, $20, or choose what you can give. Every bit helps!</h5>
        <FormCheck type="checkbox" label="Set up a monthly donation" />
        <FormCheck 
          type="checkbox" 
          label="I donated! Please don't show me this again" 
          checked={doNotShowAgain} 
          onChange={e => setDoNotShowAgain(e.target.checked)} />
      </Modal.Body>
      <Modal.Footer>
        <Form action="https://www.paypal.com/donate" method="post" target="_top" className="d-inline">
          <input type="hidden" name="hosted_button_id" value="NYGKXBQY5G4TL" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </Form>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationsModal;
