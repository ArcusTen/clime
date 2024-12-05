document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const searchButton = document.querySelector('.search-box button');
    const weatherBox = document.querySelector('.weather-box');
    const weatherDetails = document.querySelector('.weather-details');
    const error404 = document.querySelector('.not-found');
    const cityHide = document.querySelector('.city-hide');
    const inputField = document.querySelector('.search-box input');

    const APIKey = "efec1c0be75efc1c254086ba9c476d7f";

    const fetchWeather = async (city) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const updateUI = (json, city) => {
        if (json.cod === '404') {
            cityHide.textContent = city;
            container.style.height = '400px';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.classList.add('active');
            return;
        }

        const image = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        if (cityHide.textContent === city) return;

        cityHide.textContent = city;
        container.style.height = '555px';
        container.classList.add('active');
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        error404.classList.remove('active');

        const weatherImages = {
            'Clear': 'assets/clear.png',
            'Rain': 'assets/rain.png',
            'Snow': 'assets/snow.png',
            'Clouds': 'assets/cloud.png',
            'Mist': 'assets/mist.png',
            'Haze': 'assets/mist.png'
        };

        image.src = weatherImages[json.weather[0].main] || 'assets/cloud.png';
        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = json.weather[0].description;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

        cloneAndInsert('.info-weather', 'clone-info-weather');
        cloneAndInsert('.info-humidity', 'clone-info-humidity');
        cloneAndInsert('.info-wind', 'clone-info-wind');
    };

    const cloneAndInsert = (selector, cloneId) => {
        const element = document.querySelector(selector);
        const clone = element.cloneNode(true);
        clone.id = cloneId;
        clone.classList.add('active-clone');

        setTimeout(() => {
            element.insertAdjacentElement('afterend', clone);
            removeOldClones(selector);
        }, 2200);
    };

    const removeOldClones = (selector) => {
        const clones = document.querySelectorAll(`${selector}.active-clone`);
        if (clones.length > 0) {
            const firstClone = clones[0];
            firstClone.classList.remove('active-clone');
            setTimeout(() => firstClone.remove(), 2200);
        }
    };

    const handleSearch = async () => {
        const city = inputField.value.trim();
        if (!city) return;

        const weatherData = await fetchWeather(city);
        updateUI(weatherData, city);
    };

    searchButton.addEventListener('click', handleSearch);
    inputField.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) handleSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '/') {
            e.preventDefault();
            inputField.focus();
        }
    });
});
