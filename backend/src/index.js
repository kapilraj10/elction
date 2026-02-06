require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();


const corsOptions = {
  origin: 'https://elction-knon.vercel.app', // Frontend origin
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};


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
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/about", require("./routes/about.routes"));

/* server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
