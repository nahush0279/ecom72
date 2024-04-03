import { Button } from 'primereact/button';
import React from 'react';

import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/');
  };

  const goToCartPage = () => {
    navigate('/cart');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Payment Failed</h1>
      <p>Unfortunately, your payment was not successful. Please choose an option below:</p>
      <div className="mb-3">
        <Button severity="primary" onClick={goToHomePage}>
          Go to Home Page
        </Button>
      </div>
      <div>
        <Button severity="danger" onClick={goToCartPage}>
          Try Again at Cart Page
        </Button>
      </div>
    </div>
  );
};

export default Cancel;
