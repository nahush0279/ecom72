const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5000',
    'http://localhost:4000',
    'http://localhost:3000',
    'https://ecom7272.netlify.app',
    'http://localhost:5173',
    'https://9a7a-180-211-117-146.ngrok-free.app',
    'https://7731-180-211-117-146.ngrok-free.app',
    'https://ecom72.netlify.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;