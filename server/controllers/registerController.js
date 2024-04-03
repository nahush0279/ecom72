const pool = require('./db');
const axios = require('axios'); // Import axios if not already imported

const createNewUser = async (req, res) => {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }

    try {
        await pool.query('INSERT INTO users(email, name, password, gender) values(?,?,?,?)', [email, name, password, gender]);

        const [[{ userId }]] = await pool.query('SELECT userId from users where name = ?', [name]);

        await pool.query('INSERT INTO cart(userId) values(?)', [userId]);
        console.log("Cart made");

   
        const response = await axios.post(process.env.REACT_URL + 'sendMail', {
            email,
            name,
            password
        });

        console.log(response.data); 

        res.json({ "message": "User created successfully" });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = createNewUser;
