#!/usr/bin/env node

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

const city = process.argv.slice(2).join(" ").trim();

if (!city) {
  console.log("Please enter a city name.");
  console.log('Example: node index.js "Kigali"');
  process.exitCode = 1;
} else {
  try {
    // First request: look up the city and get its coordinates.
    const locationUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search",
    );

    locationUrl.searchParams.set("name", city);
    locationUrl.searchParams.set("count", "1");
    locationUrl.searchParams.set("language", "en");

    const locationResponse = await fetch(locationUrl, {
      signal: AbortSignal.timeout(8000),
    });

    if (!locationResponse.ok) {
      throw new Error("The place lookup service is unavailable.");
    }

    const locationData = await locationResponse.json();
    const place = locationData.results?.[0];

    if (!place) {
      console.log(`I couldn't find a city called "${city}".`);
      process.exitCode = 1;
    } else {
      // Second request: use the coordinates to get today's forecast.
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");

      weatherUrl.searchParams.set("latitude", place.latitude);
      weatherUrl.searchParams.set("longitude", place.longitude);
      weatherUrl.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,weather_code",
      );
      weatherUrl.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min",
      );
      weatherUrl.searchParams.set("timezone", "auto");
      weatherUrl.searchParams.set("forecast_days", "1");

      const weatherResponse = await fetch(weatherUrl, {
        signal: AbortSignal.timeout(8000),
      });

      if (!weatherResponse.ok) {
        throw new Error("The weather service is unavailable.");
      }

      const weatherData = await weatherResponse.json();

      console.log(`Weather for ${place.name}, ${place.country}`);
      console.log(`Temperature now: ${weatherData.current.temperature_2m}°C`);
      console.log(`Humidity: ${weatherData.current.relative_humidity_2m}%`);
      console.log(
        `Conditions: ${
          weatherDescriptions[weatherData.current.weather_code] ?? "Unknown"
        }`,
      );
      console.log(`Today's high: ${weatherData.daily.temperature_2m_max[0]}°C`);
      console.log(`Today's low: ${weatherData.daily.temperature_2m_min[0]}°C`);
    }
  } catch (error) {
    if (error.name === "TimeoutError") {
  console.log("The request took too long. Please try again.");
} else {
  console.log(`Could not get the weather: ${error.message}`);
}

process.exitCode = 1;
}
  }
