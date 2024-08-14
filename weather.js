const apiKey = '658ab63cff086fa13b7cf1215d8a20ed';
const cities = [
    'Târgu Jiu', 'Rovinari', 'Motru', 'Bumbești-Jiu', 'Novaci', 'Tismana', 'Țicleni',
    'Albeni', 'Arcani', 'Bălănești', 'Bălești', 'Bengești-Ciocadia', 'Bâlteni',
    'Bumbești-Pițic', 'Bustuchin', 'Crasna', 'Drăguțești', 'Fărcășești', 'Ionești',
    'Mătăsari', 'Peștișani', 'Polovragi', 'Prigoria', 'Runcu', 'Scoarța', 'Țânțăreni',
    'Telești', 'Turburea', 'Turcinești'
];

const weatherList = document.getElementById('weather-list');

async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},ro&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error(`Eroare la obținerea vremii pentru ${city}`);
    }
    const data = await response.json();
    return {
        name: city,
        temperature: data.main.temp,
        weather: data.weather[0].main // Tipul vremii (clear, rain, clouds etc.)
    };
}

function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clear':
            return '<i class="fas fa-sun weather-icon"></i>';
        case 'Rain':
            return '<i class="fas fa-cloud-showers-heavy weather-icon"></i>';
        case 'Clouds':
            return '<i class="fas fa-cloud weather-icon"></i>';
        case 'Snow':
            return '<i class="fas fa-snowflake weather-icon"></i>';
        case 'Thunderstorm':
            return '<i class="fas fa-bolt weather-icon"></i>';
        default:
            return '<i class="fas fa-question-circle weather-icon"></i>'; // Icon default pentru vreme necunoscută
    }
}

async function updateWeather() {
    weatherList.innerHTML = ''; // Curăță lista existentă
    for (const city of cities) {
        try {
            const weather = await fetchWeather(city);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${getWeatherIcon(weather.weather)}
                <span class="city-name">${weather.name}</span> 
                <span class="temperature">${weather.temperature}°C</span>
            `;
            weatherList.appendChild(listItem);
        } catch (error) {
            console.error(error.message);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <i class="fas fa-question-circle weather-icon"></i>
                <span class="city-name">${city}</span> 
                <span class="temperature">Datele nu sunt disponibile</span>
            `;
            weatherList.appendChild(listItem);
        }
    }
}

document.getElementById('refresh-button').addEventListener('click', updateWeather);

// Încărcați datele inițial
updateWeather();
