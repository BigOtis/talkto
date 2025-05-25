import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';

const fetchAvatarInfo = async (searchTerm) => {
  try {
    const response = await fetch("/api/getImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    });
    const data = await response.json();
    // If the backend returns an object with viewableName and img_url
    if (data && typeof data === 'object' && (data.viewableName || data.img_url)) {
      return data;
    }
    // Fallback: just image url
    return { img_url: data.imageUrl || data.img_url, viewableName: searchTerm };
  } catch (error) {
    console.error("Error fetching avatar info:", error);
    return { img_url: null, viewableName: searchTerm };
  }
};

const CharacterRedirect = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [avatarInfo, setAvatarInfo] = useState({ img_url: '', viewableName: name });

  useEffect(() => {
    const fetchData = async () => {
      const info = await fetchAvatarInfo(name);
      setAvatarInfo(info);
    };
    fetchData();
    const timer = setTimeout(() => {
      navigate(`/chat/${name}`);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [name, navigate]);

  const pageUrl = `https://www.otisfuse.com/redirect/${encodeURIComponent(name)}`;
  const displayName = avatarInfo.viewableName || name;
  const avatarUrl = avatarInfo.img_url;
  const title = `Engage in a Fascinating AI Chat with ${displayName} | Talk To AI`;
  const description = `Dive into a captivating conversation with ${displayName} – a unique AI personality. Unleash your curiosity and explore intriguing topics with this simulated character.`;

  return (
    <HelmetProvider>
      <Container>
        <Row className="justify-content-center align-items-center h-100">
          <Col xs={12} sm={8} md={6} lg={4} className="text-center">
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={description} />
              <link rel="canonical" href={pageUrl} />
              <meta property="og:site_name" content="Talk To AI" />
              <meta property="og:title" content={title} />
              <meta property="og:description" content={description} />
              {avatarUrl && <meta property="og:image" content={avatarUrl} />}
              <meta property="og:type" content="website" />
              <meta property="og:url" content={pageUrl} />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@briggsotis" />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={description} />
              {avatarUrl && <meta name="twitter:image" content={avatarUrl} />}
            </Helmet>
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={`Avatar of ${displayName}`}
                style={{ maxWidth: 250, maxHeight: 250 }}
              />
            )}
            <h2>Taking you to your conversation with {displayName}...</h2>
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