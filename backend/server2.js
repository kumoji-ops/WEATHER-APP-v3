const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require('path');

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.send('server2 is running');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    res.json(data);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});