#!/usr/bin/env node

const city = process.argv.slice(2).join(" ").trim();

if (!city) {
  console.log("Please enter a city name.");
  console.log('Example: node index.js "Kigali"');
  process.exitCode = 1;
} else {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("The place lookup service is unavailable.");
    }

    const data = await response.json();
    const place = data.results?.[0];

    if (!place) {
      console.log(`I couldn't find a city called "${city}".`);
      process.exitCode = 1;
    } else {
      console.log(`City found: ${place.name}, ${place.country}`);
      console.log(`Coordinates: ${place.latitude}, ${place.longitude}`);
    }
  } catch (error) {
    console.log(`Could not look up that city: ${error.message}`);
    process.exitCode = 1;
  }
}