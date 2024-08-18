const apiKey = '658ab63cff086fa13b7cf1215d8a20ed';

const weatherList = document.getElementById('weather-list');
const loader = document.getElementById('loader');

function isDaytime(time) {
    const hour = time.getHours();
    return hour >= 6 && hour <= 18;
}

function getWeatherIcon(weather, isDaytime) {
    const icons = {
        'Clear': isDaytime ? '<i class="fas fa-sun weather-icon"></i>' : '<i class="fas fa-moon weather-icon"></i>',
        'Rain': '<i class="fas fa-cloud-showers-heavy weather-icon"></i>',
        'Clouds': isDaytime ? '<i class="fas fa-cloud-sun weather-icon"></i>' : '<i class="fas fa-cloud-moon weather-icon"></i>',
        'Snow': '<i class="fas fa-snowflake weather-icon"></i>',
        'Thunderstorm': '<i class="fas fa-bolt weather-icon"></i>',
        'Mist': '<i class="fas fa-smog weather-icon"></i>'
    };
    return icons[weather] || '<i class="fas fa-question-circle weather-icon"></i>';
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`Eroare la obținerea vremii pentru locația curentă.`);
        }
        const data = await response.json();

        // Logarea răspunsului API în consolă
        console.log(data);

        const today = new Date();
        const forecasts = data.daily.slice(0, 3); // Obținem prognoza pentru 3 zile

        return forecasts.map((forecast, index) => {
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + index);
            return {
                date: forecastDate.toLocaleDateString(),
                temperature: forecast.temp.day,
                weather: forecast.weather[0].main,
                isDaytime: isDaytime(forecastDate)
            };
        });
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function updateWeather() {
    loader.style.display = 'block';
    weatherList.innerHTML = '';

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            const weatherResults = await fetchWeather(latitude, longitude);

            weatherResults.forEach(weather => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${getWeatherIcon(weather.weather, weather.isDaytime)}
                    <span class="city-name">${weather.date}</span> 
                    <span class="temperature">${weather.temperature}°C</span>
                `;
                weatherList.appendChild(listItem);
            });

        } catch (error) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <i class="fas fa-question-circle weather-icon"></i>
                <span class="city-name">Eroare</span> 
                <span class="temperature">${error.message}</span>
            `;
            weatherList.appendChild(listItem);
        } finally {
            loader.style.display = 'none';
        }
    }, (error) => {
        console.error('Eroare la obținerea locației', error);
        loader.style.display = 'none';
    });
}

document.getElementById('refresh-button').addEventListener('click', updateWeather);

// Încărcați datele inițial
updateWeather();
