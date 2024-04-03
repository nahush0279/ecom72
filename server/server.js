const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const axios = require('axios')
const cors = require('cors')
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

require('dotenv').config()
app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);
app.post('/webhook',
async (req, res) => {
  if(req.body.data.object.receipt_url){
    const url =req.body.data.object.receipt_url
    const {email, name} = req.body.data.object.billing_details 
    const response = await axios.post(process.env.API_URL + 'sendMail/receipt', {
            email,
            name,
            url
        });
  }
  res.sendStatus(200);
});

const port = process.env.PORT || 4000;
const path = require('path');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(String(process.env.STRIPE_PRIVATE_KEY))
const pool = require('./controllers/db');
const corsOptions = require('./config/corsOptions');
app.use(express.json());

app.use(cors(corsOptions));
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/info', require('./routes/api/info'));
app.use('/delete', require('./routes/api/delete'))
app.use('/update', require('./routes/api/update'))
app.use('/sendMail', require('./routes/api/sendMail'))
app.use('/sendPasswordMail', require('./routes/api/sendPasswordMail'))
app.use('/products', require('./routes/api/productsInfo'))
app.use('/cart/get', require('./routes/api/cart/getCart'))
app.use('/cart/update', require('./routes/api/cart/updateCart'))
app.use('/products/update', require('./routes/api/productUpdate'))
app.use('/products/add', require('./routes/api/productAdd'))
app.use('/products/delete', require('./routes/api/productDelete'))
app.use('/products/qty/remove', require('./routes/api/cart/addProduct'))
app.use('/products/qty/add', require('./routes/api/cart/removeProduct'))
app.use('/checkout', require('./routes/api/checkout'))
app.use('/resetPassword', require('./routes/api/resetPassword'))
app.use('/saveToken', require('./routes/api/saveToken'))
app.use('/removeToken', require('./routes/api/removeToken'))

app.use(cors({ credentials: true }));
const { logger } = require('./middleware/logEvents');
app.use(logger)
const SITE_SECRET = process.env.SITE_SECRET
app.post('/verifyCaptcha', async (request, response) => {
  const { captchaValue } = request.body
  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${SITE_SECRET}&response=${captchaValue}`,
  )
  response.send(data)
})
app.post('/webhook', async (req, res) => {
  console.log(req.body)
  const eventType = req.headers['stripe-signature'];
  const payload = req.body;

  const event = stripe.webhooks.constructEvent(payload, eventType, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      await updatePaymentStatus(paymentId, 'paid');

      await generateInvoice(paymentId);

      res.status(200).send('Webhook received successfully.');
  } else {
      res.status(200).send('Webhook received successfully.');
  }
});


app.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.json({ "message": "No auth header" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));
    req.user = decoded;
    res.json(decoded);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.json(false).status(403);
  }
});

app.get('/users-number', async (req, res) => {
  try {
    const [response] = await pool.query('SELECT count(*) as number FROM users; ');
    res.json(response[0].number);
  } catch (error) {
    res.json(false).status(403);
  }
});

app.get('/products-number', async (req, res) => {
  try {
    const [response] = await pool.query('SELECT count(*) as number FROM products; ');
    res.json(response[0].number);
  } catch (error) {
    res.json(false).status(403);
  }
});

app.get('/login-number', async (req, res) => {
  try {
    const [response] = await pool.query('SELECT count(*) as number FROM login_activity; ');
    res.json(response[0].number);
  } catch (error) {
    res.json(false).status(403);
  }
});

app.get('/sell-number', async (req, res) => {
  try {
    const charges = await stripe.charges.list({ limit: 10000 });
    const orders = charges.data.map(charge => ({
      orderId: charge.metadata.orderId,
      amount: charge.amount,
      date : new Date(charge.created * 1000)
    }));
    console.log(orders)

    const sum = orders.reduce((acc, item) => acc + item.amount, 0);
    const result = sum / 100;

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders-by-month', async (req, res) => {
  try {
    const charges = await stripe.charges.list({ limit: 100 });
    const orders = charges.data.map(charge => ({
      orderId: charge.metadata.orderId,
      amount: charge.amount,
      date: new Date(charge.created * 1000)
    }));

    const monthlyTotals = Array(12).fill(0); 
    orders.forEach(order => {
      const month = order.date.getMonth(); 
      monthlyTotals[month] += order.amount / 100;
    });

    res.json(monthlyTotals);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



app.listen(port, () => {

  console.log(`Server is running on port ${port}`);
});