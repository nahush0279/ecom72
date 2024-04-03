require('dotenv').config({ path: './../../../.env' });

const pool = require('./db');
const axios = require('axios');
const stripe = require('stripe')(String(process.env.STRIPE_PRIVATE_KEY));

const checkout = async (req, res) => {
    try {
        const lineItemsPromises = req?.body?.items?.map(async (item) => {
            const postData = { id: item.id };
            try {
                const response = await axios.post(process.env.API_URL + 'products', postData);
                const storeItem = response.data;
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: storeItem.product_name,
                        },
                        unit_amount: Math.floor(storeItem.price * 100),
                    },
                    quantity: item.quantity,
                };
            } catch (error) {
                console.error('Axios error:', error);
                throw error; 
            }
        });
        const lineItems = await Promise.all(lineItemsPromises);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: await Promise.all(lineItems),
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = checkout;
