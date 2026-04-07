// 1. Get elements
const button = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');
const now = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit' };

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

        // 9. Update the existing HTML elements
        document.querySelector('.city').textContent = data.name;
        document.querySelector('.temp').textContent = Math.round(data.main.temp) + '°';
        document.querySelector('.humidity').textContent = data.main.humidity + '%';
        document.querySelector('.wind').textContent = data.wind.speed + ' km/h';
        document.querySelector('.date').textContent = 
        now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + 
        ' - ' + now.toLocaleDateString('en-GB', options);
    });
});