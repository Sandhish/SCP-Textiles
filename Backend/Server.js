const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', require('./Routes/authRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Api is Running!' });
});

app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});