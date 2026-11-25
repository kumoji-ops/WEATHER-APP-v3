const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.send('server2 is running');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'Missing ?city= parameter' });
    }

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ cod: '404', message: 'city not found' });
        }

        const place = geoData.results[0];
        const wxRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );
        const wxData = await wxRes.json();
        const current = wxData.current;

        const code = current.weather_code;
        let mainCondition = 'Clear';
        if (code >= 95) mainCondition = 'Thunderstorm';
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) mainCondition = 'Rain';
        else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) mainCondition = 'Snow';
        else if (code >= 1 && code <= 3) mainCondition = 'Clouds';

        res.json({
            name: place.name,
            dt: Math.floor(Date.now() / 1000),
            timezone: place.utc_offset_seconds || 0,
            weather: [{ main: mainCondition }],
            main: {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m
            },
            wind: {
                speed: current.wind_speed_10m
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});