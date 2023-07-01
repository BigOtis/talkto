import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { verifyEmail, resendToken } from '../utils/userAPI'; // import resendToken

const EmailVerification = () => {
  const { email, token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleResendToken = async () => {
    const result = await resendToken(email);

    if (result.success) {
      setError('A new verification token has been sent to your email');
    } else {
      setError('Error resending verification token');
    }
  };

  useEffect(() => {
    async function verifyUserEmail() {
      const result = await verifyEmail(email, token);

      if (result.success) {
        localStorage.setItem('email', email);
        navigate('/');
      } else {
        setError('Verification token is not correct');
      }
    }

    verifyUserEmail();
  }, [email, token, navigate]);

  return (
    <div>
      {error && (
        <Alert variant="danger">
          {error}
          <Button variant="primary" onClick={handleResendToken}>
            Resend token
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default EmailVerification;
