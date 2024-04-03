require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('./db');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    if (!email || !password) return res.status(400).json({ "message": "Username and password both required" });

    try {
        const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (result.length > 0) {
            const foundUser = result[0]; 
            const match =  (password == foundUser.password) 

            if (match) {
                const accessToken = jwt.sign(
                    { user : foundUser }, 
                    String(process.env.ACCESS_TOKEN_SECRET),
                    { expiresIn: '3000s' }
                );

                const refreshToken = jwt.sign(
                    {user : foundUser}, 
                    String(process.env.REFRESH_TOKEN_SECRET),
                    { expiresIn: '1d' }
                );

                await pool.query('INSERT INTO login_activity (user_id) values (?) ', [foundUser.userId]);

                res.json({ user: foundUser, accessToken: accessToken, refreshToken: refreshToken });
            } else {
                res.status(401).json({ "message": "Incorrect password" });
            }
        } else {
            res.status(401).json({ "message": "User not found" });
        }
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = handleLogin;
