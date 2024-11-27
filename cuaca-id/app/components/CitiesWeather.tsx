import axios from "axios";
import { useEffect, useState } from "react";
import { kelvinToCelsius, kelvinToFahrenheit } from "../lib/convert";
import { Loader2 } from "lucide-react";

const cities = [
  "Banda Aceh",
  "Medan",
  "Palembang",
  "Padang",
  "Bengkulu",
  "Pekanbaru",
  "Tanjung Pinang",
  "Jambi",
  "Bandar Lampung",
  "Pangkal Pinang",
  "Pontianak",
  "Samarinda",
  "Banjarbaru",
  "Palangkaraya",
  "Tanjung Selor",
  "Serang",
  "Jakarta",
  "Bandung",
  "Semarang",
  "Yogyakarta",
  "Surabaya",
  "Denpasar",
  "Kupang",
  "Mataram",
  "Gorontalo",
  "Mamuju",
  "Palu",
  "Manado",
  "Kendari",
  "Makassar",
  "Sofifi",
  "Ambon",
  "Manokwari",
  "Jayapura",
  "Nabire",
  "Jayawijaya",
  "Merauke",
  "Sorong",
];

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
  }[];
}

export default function CitiesWeather() {
  const [citiesWeather, setCitiesWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather();
    }, 10000);

    fetchWeather();

    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    const randomCities = cities.sort(() => 0.5 - Math.random()).slice(0, 5);
    try {
      setLoading(true);
      const weatherPromises = randomCities.map((city) =>
        axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        )
      );
      const weatherResponses = await Promise.all(weatherPromises);
      const weatherData = weatherResponses.map((response) => response.data);
      setCitiesWeather(weatherData);
    } catch (error) {
      console.log("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="size-4 mr-2 animate-spin" />
        Fetching cities weathers data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {citiesWeather.map((cityWeather, index) => (
        <div key={index} className="grid gap-8  bg-secondary rounded-md p-4">
          <div className="flex justify-between">
            <h2 className="font-bold text-2xl">{cityWeather.name}</h2>
            <p className="text-3xl font-bold">
              {localStorage.getItem("tempUnit") === "C"
                ? kelvinToCelsius(cityWeather.main.temp) + "°C"
                : kelvinToFahrenheit(cityWeather.main.temp) + "°F"}
            </p>
          </div>
          <div className="flex justify-between">
            <p>{cityWeather.weather[0].description}</p>
            <p>
              L :{" "}
              {localStorage.getItem("tempUnit") === "C"
                ? kelvinToCelsius(cityWeather.main.temp_min) + "°C"
                : kelvinToFahrenheit(cityWeather.main.temp_min) + "°F"}
              °&nbsp;&nbsp;&nbsp;H :{" "}
              {localStorage.getItem("tempUnit") === "C"
                ? kelvinToCelsius(cityWeather.main.temp_max) + "°C"
                : kelvinToFahrenheit(cityWeather.main.temp_max) + "°F"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
