// 1. Get elements
const button = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');

function changeBackgroundByWeather(weatherCondition) {
    const condition = weatherCondition.toLowerCase();

    if (condition === 'clear') {
        document.body.style.backgroundImage = "url('images/sunny.png')";
    } else if (condition === 'clouds') {
        document.body.style.backgroundImage = "url('images/cloudy2.png')";
    } else if (condition === 'rain') {
        document.body.style.backgroundImage = "url('images/rainy.png')";
    } else if (condition === 'thunderstorm') {
        document.body.style.backgroundImage = "url('images/stormy.png')";
    } else if (condition === 'snow') {
        document.body.style.backgroundImage = "url('images/snowy.png')";
    } else {
        document.body.style.backgroundImage = "url('images/SatelliteView.png')";
    }

    // Keep the same background settings
    document.body.style.backgroundSize = "100% 100%";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

// 2. Add event listener
button.addEventListener('click', function () {
    // 3. Get what the user typed
    const city = input.value.trim();

    // 4. Check if input is empty
    if (city === "") {
        alert('Please enter a city name!');
        return;
    }

    // 5. Fetch weather from your backend (Codespaces port 5000)
    fetch(`https://fantastic-space-telegram-69w49xjgrrv62rpx4-5000.app.github.dev/weather?city=${encodeURIComponent(city)}`)
        // 6. Convert response to JSON
        .then(response => response.json())
        // 7. Work with the data
        .then(data => {
            console.log("API response:", data);

            // 8. Safely handle API errors or missing weather array
            if (!data.weather || !data.weather[0]) {
                if (data.cod === "404" || data.cod === 404) {
                    alert('City not found, please try again!');
                } else {
                    alert(data.message || data.error || 'Could not retrieve weather data.');
                }
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

            // Get city's local time
            const unixTimestamp = data.dt;
            const timezoneOffset = data.timezone; // in seconds

            const localTimeMs = (unixTimestamp + timezoneOffset) * 1000;
            const dateObject = new Date(localTimeMs);

            const timeString = dateObject.toLocaleTimeString("en-GB", {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            });

            const dateString = dateObject.toLocaleDateString("en-GB", {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: '2-digit',
                timeZone: 'UTC'
            });

            document.querySelector('.date').textContent = `${timeString} - ${dateString}`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong!');
        });
});