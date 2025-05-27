import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Spinner, Table } from 'react-bootstrap';
import Header from '../components/Header';
import './StatsSplit.css';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <p>{error}</p>
      </Container>
    );
  }

  // Defensive checks
  const topAvatars = Array.isArray(stats?.topAvatars) ? stats.topAvatars : [];
  const totalUsers = typeof stats?.totalUsers === 'number' ? stats.totalUsers : 0;
  const messagesThisMonth = typeof stats?.messagesThisMonth === 'number' ? stats.messagesThisMonth : 0;
  const messagesAllTime = typeof stats?.messagesAllTime === 'number' ? stats.messagesAllTime : 0;
  const totalCharacters = typeof stats?.totalCharacters === 'number' ? stats.totalCharacters : 0;
  const totalUsersThisMonth = typeof stats?.totalUsersThisMonth === 'number' ? stats.totalUsersThisMonth : 0;
  const totalCharactersThisMonth = typeof stats?.totalCharactersThisMonth === 'number' ? stats.totalCharactersThisMonth : 0;

  function formatNumber(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return n;
  }

  return (
    <Container className="mt-5">
      <Header head="Site Stats" description="Live usage statistics for TalkToAI" />
      <Row className="mb-4">
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="split-stat">
                <span>{formatNumber(totalUsersThisMonth)}</span>
                <span className="split-divider">/</span>
                <span>{formatNumber(totalUsers)}</span>
              </Card.Text>
              <div className="split-labels">
                <span>This Month</span>
                <span>All Time</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Messages</Card.Title>
              <Card.Text className="split-stat">
                <span>{formatNumber(messagesThisMonth)}</span>
                <span className="split-divider">/</span>
                <span>{formatNumber(messagesAllTime)}</span>
              </Card.Text>
              <div className="split-labels">
                <span>This Month</span>
                <span>All Time</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Total Characters Created</Card.Title>
              <Card.Text className="split-stat">
                <span>{formatNumber(totalCharactersThisMonth)}</span>
                <span className="split-divider">/</span>
                <span>{formatNumber(totalCharacters)}</span>
              </Card.Text>
              <div className="split-labels">
                <span>This Month</span>
                <span>All Time</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Top 10 Most Popular Avatars</h3>
          {topAvatars.length === 0 ? (
            <div>No avatar stats available.</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Messages</th>
                  <th>Chat Link</th>
                </tr>
              </thead>
              <tbody>
                {topAvatars.map((avatar, idx) => (
                  <tr key={avatar.viewableName || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      {avatar.img_url ? (
                        <Image src={avatar.img_url} roundedCircle width={48} height={48} alt={avatar.viewableName} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{(avatar.viewableName && avatar.viewableName.length > 30) ? avatar.viewableName.slice(0, 30) + '...' : avatar.viewableName || 'N/A'}</td>
                    <td>{typeof avatar.messages === 'number' ? avatar.messages : 'N/A'}</td>
                    <td>
                      {avatar.viewableName ? <a href={`/redirect/${avatar.viewableName}`}>Start Chat</a> : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats; 