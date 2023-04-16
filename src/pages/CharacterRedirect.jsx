import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';


const fetchImageUrl = async (searchTerm) => {
    try {
      const response = await fetch("/api/getImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });
  
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };

  const CharacterRedirect = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        const url = await fetchImageUrl(name);
        setAvatarUrl(url);
      };
  
      fetchData();
  
      const timer = setTimeout(() => {
        navigate(`/chat/${name}`);
      }, 3000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [name, navigate]);

    return (
      <HelmetProvider>
        <Container>
          <Row className="justify-content-center align-items-center h-100">
            <Col xs={12} sm={8} md={6} lg={4} className="text-center">
            <Helmet>
              <title>{`Engage in a Fascinating AI Chat with ${name} | Talk To AI`}</title>
              <meta name="description" content={`Dive into a captivating conversation with ${name} – a unique AI personality. Unleash your curiosity and explore intriguing topics with this simulated character.`} />
              
              <meta property="og:site_name" content="Talk To AI" />
              <meta property="og:title" content={`Engage in a Fascinating AI Chat with ${name} | Talk To AI`} />
              <meta property="og:description" content={`Dive into a captivating conversation with ${name} – a unique AI personality. Unleash your curiosity and explore intriguing topics with this simulated character.`} />
              {avatarUrl && <meta property="og:image" content={avatarUrl} />}
              <meta property="og:type" content="website" />
              <meta property="og:url" content={`https://www.otisfuse.com/redirect/${name}`} />

              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@briggsotis" />
              <meta name="twitter:title" content={`Engage in a Fascinating AI Chat with ${name} | Talk To AI`} />
              <meta name="twitter:description" content={`Dive into a captivating conversation with ${name} – a unique AI personality. Unleash your curiosity and explore intriguing topics with this simulated character.`} />
              {avatarUrl && <meta name="twitter:image" content={avatarUrl} />}
            </Helmet>
            {avatarUrl && (
                <Image 
                  src={avatarUrl} 
                  alt={`Avatar of ${name}`}
                  style={{ maxWidth: 250, maxHeight: 250 }}
                />
              )}
              <h2>Taking you to your conversation with {name}...</h2>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </HelmetProvider>
    );
  };
  
  export default CharacterRedirect;