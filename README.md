# ikirere

ikirere is a simple weather tool that runs in your terminal. Enter a city to see its temperature, humidity, conditions, and today's high and low.

## Requirements

- Node.js 18 or newer
- An internet connection

## Install

Clone this project and enter its folder:

```bash
git clone https://github.com/umutoni-dinah/week6-ikirere-CLI.git
cd week6-ikirere-CLI
```

Install the `ikirere` terminal command:

```bash
npm link
```

No extra packages or API key are needed.

## Use

```bash
ikirere Nairobi
ikirere "Cape Town"
ikirere --help
```

View recent searches and save or list favorite cities:

```bash
ikirere history
ikirere favorite add Kigali
ikirere favorite list
```

Set the temperature unit. Your choice is saved for future runs:

```bash
ikirere settings fahrenheit
ikirere settings celsius
```

## Environment setting

`IKIRERE_UNITS` can set the temperature unit for the current terminal session. It takes priority over the saved setting.

In PowerShell:

```powershell
$env:IKIRERE_UNITS = "fahrenheit"
ikirere Nairobi
```

## Walkthrough

1. ikirere looks up the city name to find its coordinates.
2. It uses those coordinates to request a weather forecast.
3. It displays the current weather and today's high and low.
4. It saves recent searches, favorite cities, and temperature settings as JSON files in a `.ikirere` folder in your home folder.

The project uses Node.js's built-in `fetch`, so it does not need an extra HTTP package. Weather and location data come from [Open-Meteo](https://open-meteo.com/).

## Run from the project folder

You can also run ikirere without installing the terminal command:

```bash
npm start -- Nairobi
```