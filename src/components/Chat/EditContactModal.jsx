import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useEffect } from "react";

const EditContactModal = ({ contact, onContactChange, showEditContactModal, setShowEditContactModal }) => {
  const [name, setName] = useState(contact.name);
  const [description, setDescription] = useState(contact.description || '');
  const [avatarUrl, setAvatarUrl] = useState(contact.avatar);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setName(contact.name);
    setDescription(contact.description || '');
    setAvatarUrl(contact.avatar);
  }, [contact]);  

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAvatarUrlChange = (event) => {
    setAvatarUrl(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

    const handleSaveClick = () => {
        let newAvatar = avatarUrl;
        if (file !== null) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                newAvatar = imageData;

                const updatedContact = {
                    ...contact,
                    name,
                    description,
                    avatar: newAvatar
                };
                
                onContactChange(updatedContact);
            };
            reader.readAsDataURL(file);
        } else {
            const updatedContact = {
                ...contact,
                name,
                description,
                avatar: newAvatar
            };
            
            onContactChange(updatedContact);
        }
    };

  return (
    <Modal show={showEditContactModal} onHide={() => setShowEditContactModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={handleNameChange} />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={description} onChange={handleDescriptionChange} />
          </Form.Group>
          <Form.Group controlId="formAvatarUrl">
            <Form.Label>Avatar URL</Form.Label>
            <Form.Control type="text" placeholder="Enter image URL" value={avatarUrl} onChange={handleAvatarUrlChange} />
          </Form.Group>
          <Form.Group controlId="formFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditContactModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditContactModal;
