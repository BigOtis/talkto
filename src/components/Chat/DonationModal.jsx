import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DonationsModal = ({ showDonationModal, setShowDonationModal }) => {
  return (
    <Modal show={showDonationModal} onHide={() => setShowDonationModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Support Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Thanks for using OtisFuse chat! If you've found it fun, please consider making a donation to keep this service running ad-free.</p>
        <form action="https://www.paypal.com/donate" method="post" target="_top">
          <input type="hidden" name="hosted_button_id" value="NYGKXBQY5G4TL" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDonationModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationsModal;
