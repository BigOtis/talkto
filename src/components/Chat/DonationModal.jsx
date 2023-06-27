import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DonationsModal = ({ showDonationModal, setShowDonationModal }) => {
  return (
    <Modal show={showDonationModal} onHide={() => setShowDonationModal(false)}>
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
        <blockquote className="blockquote">
          <p><i>"I love using OtisFuse chat. It's helped me stay connected with my friends and family. I happily support them!"</i></p>
          <footer className="blockquote-footer">Happy User</footer>
        </blockquote>
        <h5>Suggested donation amounts: $5, $10, $20, or choose what you can give. Every bit helps!</h5>
        <Form.Check type="checkbox" label="Set up a monthly donation" />
      </Modal.Body>
      <Modal.Footer>
        <Form action="https://www.paypal.com/donate" method="post" target="_top" className="d-inline">
          <input type="hidden" name="hosted_button_id" value="NYGKXBQY5G4TL" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </Form>
        <Button variant="secondary" onClick={() => setShowDonationModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationsModal;
