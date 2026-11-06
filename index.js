#!/usr/bin/env node

const city = process.argv.slice(2).join(" ").trim();

if (!city) {
  console.log("Please enter a city name.");
  console.log('Example: node index.js "Kigali"');
  process.exitCode = 1;
} else {
  try {
    // First request: look up the city and get its coordinates.
    const locationUrl =
      new URL("https://geocoding-api.open-meteo.com/v1/search");

    locationUrl.searchParams.set("name", city);
    locationUrl.searchParams.set("count", "1");
    locationUrl.searchParams.set("language", "en");

    const locationResponse = await fetch(locationUrl);

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
      const weatherUrl =
        new URL("https://api.open-meteo.com/v1/forecast");

      weatherUrl.searchParams.set("latitude", place.latitude);
      weatherUrl.searchParams.set("longitude", place.longitude);
      weatherUrl.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m"
      );
      weatherUrl.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min"
      );
      weatherUrl.searchParams.set("timezone", "auto");
      weatherUrl.searchParams.set("forecast_days", "1");

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error("The weather service is unavailable.");
      }

      const weatherData = await weatherResponse.json();

      console.log(`Weather for ${place.name}, ${place.country}`);
      console.log(
        `Temperature now: ${weatherData.current.temperature_2m}°C`
      );
      console.log(
        `Humidity: ${weatherData.current.relative_humidity_2m}%`
      );
      console.log(
        `Today's high: ${weatherData.daily.temperature_2m_max[0]}°C`
      );
      console.log(
        `Today's low: ${weatherData.daily.temperature_2m_min[0]}°C`
      );
    }
  } catch (error) {
    console.log(`Could not get the weather: ${error.message}`);
    process.exitCode = 1;
  }
}