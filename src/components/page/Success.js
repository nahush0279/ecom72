import { Button } from 'primereact/button';
import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(redirectTimeout); 
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Payment Successful!</h1>
      <p>Your payment was successful. Thank you for your purchase.</p>
      <Button severity="primary" onClick={() => navigate('/')}>
        Redirecting...
      </Button>
    </div>
  );
};

export default Success;
