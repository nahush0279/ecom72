const pool = require('./db');
const axios = require('axios');

const resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    console.log(email, oldPassword, newPassword )

    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'All fields are required' });
    try {
        const response = await axios.get(`${process.env.API_URL}info?email=${email}`);
        if (oldPassword === response.data.password) {
            try {
                await pool.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
                res.json({ success: 'Password Successfully Updated' });
            } catch (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.json({ error: 'Incorrect old password' });
        }
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = resetPassword;
