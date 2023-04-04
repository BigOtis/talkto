import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AvatarModal = ({ avatar, onAvatarChange, showAvatarModal, setShowAvatarModal }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSaveClick = () => {
    if (imageUrl !== "") {
      onAvatarChange(imageUrl);
    } else if (file !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        onAvatarChange(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Change Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <img src={avatar} alt="Current Avatar" className="rounded-circle me-3" style={{ width: "50px", height: "50px" }} />
          <div>
            <p className="mb-1">Current Avatar</p>
            <p className="mb-0">Click below to upload a new image or enter a URL:</p>
          </div>
        </div>
        <Form>
          <Form.Group controlId="formImageUrl">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="text" placeholder="Enter image URL" value={imageUrl} onChange={handleImageUrlChange} />
          </Form.Group>
          <Form.Group controlId="formFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvatarModal;
