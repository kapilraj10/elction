require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* CORS configuration */
// Allow the frontend origin to make requests and allow credentials (cookies, Authorization header)
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (origin === FRONTEND_ORIGIN) return callback(null, true);
    // you can add more allowed origins or implement a whitelist check here
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

/* middleware */
app.use(cors(corsOptions));
// enable pre-flight across-the-board
app.options('*', cors(corsOptions));
app.use(express.json());

/* database */
connectDB();

/* routes */
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/suggestions', require('./routes/suggestion.routes'));
app.use('/api/commitments', require('./routes/commitment.routes'));

/* server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
