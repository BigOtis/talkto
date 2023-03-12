import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import test1 from '../img/test1.jpg';
import test2 from '../img/test2.jpg';
import test3 from '../img/test3.jpg';
import test6 from '../img/test6.png';
import sassole from '../img/sassole.jpg';

const testimonials = [
  {
    id: 1,
    name: 'Bob Aboey',
    text: 'Otisfuse.com helped me tremendously when I was struggling to come up with ideas for my essay. The AI generated a simple essay that provided me with a great starting point for my own work.',
    image: test6,
    role: "Student"
  },
  {
    id: 2,
    name: 'essaymaster29',
    text: 'I was skeptical about using an AI service to help with my essay, but I decided to give otisfuse.com a try. I was blown away by how easy it was to use, and how quickly the AI generated a solid foundation for my essay.',
    image: test1,
    role: "College English Major"
  },
  {
    id: 3,
    name: 'Louise Sassole Jr',
    text: 'As someone who struggles with writer\'s block, otisfuse.com was a lifesaver for me. The AI generated a basic essay that provided me with a clear direction for my writing.',
    image: sassole,
    role: "Writer"
  },
  {
    id: 4,
    name: 'Bobby Fletcher',
    text: 'I was on a tight deadline for an essay, and I was really struggling to come up with ideas. Otisfuse.com saved the day for me. The AI generated a basic essay that gave me a starting point, and I was able to quickly build upon it and produce a well-written essay that I was proud to turn in on time.',
    image: test2,
    role: "High School Student"
  },
  {
    id: 5,
    name: 'Gordina Costwoman',
    text: 'I was hesitant to try otisfuse.com at first, but I\'m so glad that I did. The AI generated a basic essay that gave me a clear understanding of what my essay should be about.',
    image: test3,
    role: "Researcher"
  },
];

const Testimonials = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">Testimonials</h2>
      <Row className="justify-content-center">
        {testimonials.map((testimonial) => (
          <Col xs={12} md={6} lg={4} className="mb-4" key={testimonial.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <p className="card-text">{testimonial.text}</p>
                <div className="mt-3 d-flex align-items-center">
                  <div className="avatar rounded-circle bg-secondary text-light d-flex align-items-center justify-content-center mr-3">
                    <Image src={testimonial.image} roundedCircle style={{width: '75px', height: '75px', padding: '5px'}}/>
                  </div>
                  <div style={{padding: '10px'}}>
                    <p className="font-weight-bold mb-0">{testimonial.name}</p>
                    <small className="text-muted">{testimonial.role}</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
