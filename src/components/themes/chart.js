import React, { lazy, Suspense } from 'react';
import { styled } from '@mui/system';

const ApexChart = lazy(() => import('react-apexcharts'));

const LoadingFallback = () => null; // You can customize your loading component if needed

const StyledChart = styled(ApexChart)``;

const Chart = (props) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StyledChart {...props} />
    </Suspense>
  );
};

export default Chart;
