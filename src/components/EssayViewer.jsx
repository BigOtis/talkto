import { Form, Container, Row, Col } from 'react-bootstrap'
import React, { useState } from 'react';
import { getEssays } from '../utils/essayStorage';
import { Link } from "react-router-dom";

// This component will display all historical essays that have been generated
const EssayViewer = () => {
    const essays = getEssays();
    const [searchText, setSearchText] = useState("");

    if (essays.length === 0) {
        return (
            <Container className="my-3 d-flex justify-content-center">
                <p>No essays have been generated yet.</p>
                <Link to="/essay" className="nav-link px-2 link-secondary">
                    Click here to generate a new essay.
              </Link>
            </Container>
        );
    };
    
    const filteredEssays = essays.filter(essay => {
        return essay.title.toLowerCase().includes(searchText.toLowerCase()) 
                || essay.prompt.toLowerCase().includes(searchText.toLowerCase())
                || essay.output.toLowerCase().includes(searchText.toLowerCase());
    });
    
    return (        
        <Container className="my-3">
            <Row>
                <Col sm={12} md={12} lg={12}>
                    <Form className="my-3">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Search by title, prompt, or output"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                {filteredEssays.map((essay) => 
                    <Col sm={12} md={6} lg={4}>
                        <div className="my-3">
                            <h3>{essay.title}</h3>
                            <h4>{essay.prompt}</h4>
                            <p>{essay.output}</p>
                            <hr/>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}
    

export default EssayViewer;
