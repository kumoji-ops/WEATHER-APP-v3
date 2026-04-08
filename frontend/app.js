// 1. Get elements
const button = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');


function changeBackgroundByWeather(weatherCondition) {
    const condition = weatherCondition.toLowerCase();

    if (condition === 'clear') {
        document.body.style.backgroundImage = "url('images/sunny.png')";
    }
    else if (condition === 'clouds') {
        document.body.style.backgroundImage = "url('images/cloudy2.png')";
    }
    else if (condition === 'rain') {
        document.body.style.backgroundImage = "url('images/rainy.png')";
    }
    else if (condition === 'thunderstorm') {
        document.body.style.backgroundImage = "url('images/stormy.png')";
    }
        else if (condition === 'snow') {
            document.body.style.backgroundImage = "url('images/snowy.png')";
        }
        else {
            document.body.style.backgroundImage = "url('images/SatelliteView.png')";

        }

        // keep the same background settings
        document.body.style.backgroundSize = "100% 100%";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

}


// 2. Add event listener
button.addEventListener('click', function () {
    // 3. Get what the user typed
    const city = input.value;

    // 4. Check if input is empty
    if (city === "") {
        alert('Please enter a city name!');
        return;
    }

    // 5. Fetch weather from your backend
    fetch(`http://localhost:5000/weather?city=${city}`)

    // 6. Convert response to JSON
    .then(response => response.json())

    // 7. Work with the data
    .then(data => {

        // 8. Check if city is found
        if (data.cod === "404") {
            alert('City not found, please try again!');
            return;
        }
        console.log("Weather condition:", data.weather[0].main);
        console.log("condition in lowercase:", data.weather[0].main.toLowerCase());

        // Change background based on weather condition
        changeBackgroundByWeather(data.weather[0].main);

        // 9. Update the existing HTML elements
        document.querySelector('.city').textContent = data.name;
        document.querySelector('.temp').textContent = Math.round(data.main.temp) + '°';
        document.querySelector('.humidity').textContent = data.main.humidity + '%';
        document.querySelector('.wind').textContent = data.wind.speed + ' km/h';

// Get city's local time - SIMPLE WORKING VERSION
// Inside your .then(data => { ... }) block:
const unixTimestamp = data.dt;
const timezoneOffset = data.timezone; // in seconds

// Convert to milliseconds and adjust for the city's timezone
const localTimeMs = (unixTimestamp + timezoneOffset) * 1000;
const dateObject = new Date(localTimeMs);

// Format the time
const timeString = dateObject.toLocaleTimeString("en-GB", {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC'
});

// Format the date
const dateString = dateObject.toLocaleDateString("en-GB", {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC'
});

// Combine them
document.querySelector('.date').textContent = `${timeString} - ${dateString}`;
    })

    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong!');

    });
});


