// Weather Service - Gets real weather based on user location
// Uses free Open-Meteo API (no API key required)

interface WeatherData {
    temperature: number;
    condition: string;
    icon: string;
}

const defaultWeather: WeatherData = {
    temperature: 25,
    condition: 'Sunny',
    icon: '☀️'
};

// Weather codes to icons/descriptions
const weatherCodeMap: Record<number, { icon: string; condition: string }> = {
    0: { icon: '☀️', condition: 'Clear' },
    1: { icon: '🌤️', condition: 'Mostly Clear' },
    2: { icon: '⛅', condition: 'Partly Cloudy' },
    3: { icon: '☁️', condition: 'Cloudy' },
    45: { icon: '🌫️', condition: 'Foggy' },
    48: { icon: '🌫️', condition: 'Icy Fog' },
    51: { icon: '🌧️', condition: 'Light Drizzle' },
    53: { icon: '🌧️', condition: 'Drizzle' },
    55: { icon: '🌧️', condition: 'Heavy Drizzle' },
    61: { icon: '🌧️', condition: 'Light Rain' },
    63: { icon: '🌧️', condition: 'Rain' },
    65: { icon: '🌧️', condition: 'Heavy Rain' },
    71: { icon: '🌨️', condition: 'Light Snow' },
    73: { icon: '🌨️', condition: 'Snow' },
    75: { icon: '🌨️', condition: 'Heavy Snow' },
    80: { icon: '🌦️', condition: 'Showers' },
    95: { icon: '⛈️', condition: 'Thunderstorm' },
};

export const getWeatherByLocation = async (): Promise<WeatherData> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(defaultWeather);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                    );
                    const data = await response.json();

                    const temp = Math.round(data.current.temperature_2m);
                    const code = data.current.weather_code;
                    const weather = weatherCodeMap[code] || { icon: '☀️', condition: 'Clear' };

                    resolve({
                        temperature: temp,
                        condition: weather.condition,
                        icon: weather.icon
                    });
                } catch (error) {
                    console.log('Weather fetch failed, using default');
                    resolve(defaultWeather);
                }
            },
            () => {
                // User denied location or error
                resolve(defaultWeather);
            },
            { timeout: 5000 }
        );
    });
};
