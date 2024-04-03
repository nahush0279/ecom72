import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, menuClasses } from '@mui/material';
import { OverviewUsers } from 'src/components/themes/sections/overview/overview-users';
import { OverviewSales } from 'src/components/themes/sections/overview/overview-sales';
import { OverviewTotalLogins } from 'src/components/themes/sections/overview/overview-total-logins';
import { OverviewTotalSell } from 'src/components/themes/sections/overview/overview-total-sell';
import UserAdmin from '../Admin/UserAdmin';
import ProductAdmin from '../Admin/ProductAdmin';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { OverviewProducts } from '../themes/sections/overview/overview-products.js';

function Admin() {

  const view = useSelector((state) => state.auth.table)
  const [userNumber, setUserNumber] = useState(null);
  const [loginNumber, setLoginNumber] = useState(null);
  const [saleNumber, setSaleNumber] = useState(null);
  const [orderByMonth, setOrderByMonth] = useState(null);
  const [productsNumber, setProductsNumber] = useState(null);

  const getUsersNumber = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'users-number');
      setUserNumber(response.data);
    } catch (error) {
      console.error('Error fetching user number:', error);
    }
  };

  const getProductsNumber = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'products-number');
      setProductsNumber(response.data);
    } catch (error) {
      console.error('Error fetching user number:', error);
    }
  };


  const getLoginNumber = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'login-number');
      setLoginNumber(response.data);
    } catch (error) {
      console.error('Error fetching login number:', error);
    }
  };


  const getSellingNumber = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'sell-number');
      setSaleNumber(response.data);
    } catch (error) {
      console.error('Error fetching login number:', error);
    }
  };

  const getOrderByMonthArray = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'orders-by-month');
      setOrderByMonth(response.data);
    } catch (error) {
      console.error('Error fetching login count array :', error);
    }
  };

  useEffect(() => {
    getUsersNumber();
    getLoginNumber()
    getSellingNumber()
    getProductsNumber()
    getOrderByMonthArray()
  }, []);

  return (

    <div >

      <div  >
        {view == 'products' &&
          <ProductAdmin />
        }

        {view == 'users' &&
          <UserAdmin />
        }


        {view == 'admin' &&
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
              overflow: 'auto'
            }}
          >
            <Container maxWidth="100vw">
              <Grid container>
                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewUsers
                    sx={{ height: '100%' }}
                    value={userNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewProducts
                    sx={{ height: '100%' }}
                    value={productsNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewTotalLogins
                    difference={16}
                    positive={false}
                    sx={{ height: '100%' }}
                    value={loginNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <OverviewTotalSell
                    sx={{ height: '100%' }}
                    value={`₹ ${saleNumber}`}
                  />
                </Grid>
                {orderByMonth && <Grid item xs={12} lg={12}>
                  <OverviewSales
                    chartSeries={[
                      {
                        name: 'This year',
                        data: orderByMonth,
                      },
                      {
                        name: 'Last year',
                        data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                      },
                    ]}
                    sx={{ height: '100%' }}
                  />
                </Grid>}


              </Grid>
            </Container>

          </Box>}
      </div></div>
  )
}

export default Admin
