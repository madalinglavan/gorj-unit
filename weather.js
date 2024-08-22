const apiKey = '658ab63cff086fa13b7cf1215d8a20ed';
const cities = [
    'Albeni', 'Alimpești', 'Aninoasa', 'Arcani', 'Baia de Fier',
    'Bălănești', 'Bălești', 'Bărbătești', 'Bengești', 
    'Berlești', 'Bâlteni', 'Bolboși', 'Borăscu', 'Brănești',
    'Bumbești-Pițic', 'Bustuchin', 'Câlnic', 'Căpreni', 'Cătunele',
    'Ciuperceni', 'Crasna', 'Crușeț', 'Dănciulești', 'Dănești',
    'Drăgotești', 'Drăguțești', 'Fărcășești', 'Glogova', 
    'Godinești', 'Hurezani', 'Ionești', 'Jupânești', 'Lelești',
    'Licurici', 'Mătăsari', 'Mușetești', 'Negomir',
    'Padeș', 'Peștișani', 'Plopșoru', 'Polovragi', 'Prigoria',
    'Roșia de Amaradia', 'Runcu', 'Săcelu', 'Samarinești', 
    'Săulești', 'Schela', 'Scoarța', 'Slivilești', 'Stănești',
    'Stejari', 'Stoina', 'Târgu Logrești', 'Târgu Jiu', 
    'Târgu Cărbuneşti', 'Țânțăreni', 'Telești', 'Turburea',
    'Turcinești', 'Urdari', 'Văgiulești', 'Vladimir'
];

const weatherList = document.getElementById('weather-list');
const loader = document.getElementById('loader');
const rightPanel = document.querySelector('.right-home-panel');
const locationButton = document.getElementById('location-button');

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

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},ro&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Orașul ${city} nu a fost găsit.`);
            }
            throw new Error(`Eroare la obținerea vremii pentru ${city}`);
        }
        const data = await response.json();
        const localTime = new Date(data.dt * 1000);

        return {
            name: city,
            temperature: data.main.temp,
            weather: data.weather[0].main,
            isDaytime: isDaytime(localTime)
        };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function updateWeather() {
    loader.style.display = 'block';
    weatherList.innerHTML = '';

    const weatherPromises = cities.map(city => fetchWeather(city).catch(error => ({
        name: city,
        temperature: 'N/A',
        weather: 'Unknown',
        error: error.message
    })));

    const weatherResults = await Promise.all(weatherPromises);

    weatherResults.forEach(weather => {
        const listItem = document.createElement('li');
        if (weather.error) {
            listItem.innerHTML = `
                <i class="fas fa-question-circle weather-icon"></i>
                <span class="city-name">${weather.name}</span> 
                <span class="temperature">${weather.error}</span>
            `;
        } else {
            listItem.innerHTML = `
                ${getWeatherIcon(weather.weather, weather.isDaytime)}
                <span class="city-name">${weather.name}</span> 
                <span class="temperature">${weather.temperature}°C</span>
            `;
        }

        // Verifică dacă orașul este Târgu Jiu
        if (weather.name === 'Târgu Jiu') {
            rightPanel.innerHTML = `
                <h3>${weather.name}</h3>
                ${getWeatherIcon(weather.weather, weather.isDaytime)}
                <span class="temperature">${weather.temperature}°C</span>
            `;
            rightPanel.appendChild(locationButton);  // Reatașăm butonul de locație
        } else {
            weatherList.appendChild(listItem);
        }
    });

    loader.style.display = 'none';
}

locationButton.addEventListener('click', updateWeatherForLocation);

async function fetchWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Eroare la obținerea vremii pentru locația dvs.');
        }
        const data = await response.json();
        const localTime = new Date(data.dt * 1000);

        return {
            name: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].main,
            isDaytime: isDaytime(localTime)
        };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function updateWeatherForLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const weather = await fetchWeatherByLocation(lat, lon);

                // Actualizăm informațiile pentru locația curentă
                rightPanel.innerHTML = `
                    <h3>${weather.name}</h3>
                    ${getWeatherIcon(weather.weather, weather.isDaytime)}
                    <span class="temperature">${weather.temperature}°C</span>
                `;
                rightPanel.appendChild(locationButton);  // Reatașăm butonul de locație
            } catch (error) {
                rightPanel.innerHTML = `
                    <h3>Eroare</h3>
                    <p>Nu am putut obține vremea pentru locația dvs.</p>
                `;
            }
        }, (error) => {
            console.error(error);
            rightPanel.innerHTML = `
                <h3>Eroare</h3>
                <p>Nu s-a putut obține locația dvs. Asigurați-vă că aveți permisiunea activată.</p>
            `;
        });
    } else {
        rightPanel.innerHTML = `
            <h3>Eroare</h3>
            <p>Browser-ul dvs. nu suportă geolocalizarea.</p>
        `;
    }
}

document.getElementById('refresh-button').addEventListener('click', updateWeather);

// Încărcați datele inițial
updateWeather();
