import { useEffect, useState } from "react";
import { celciusToFahrenheit, msToKmh, msToMph } from "../lib/convert";
import Image from "next/image";

type WeatherData = {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
};

interface CurrentWeatherProps {
  currentWeatherData: WeatherData;
}

export default function CurrentWeather({
  currentWeatherData,
}: // clientData,
CurrentWeatherProps) {
  // const [temp, setTemp] = useState(currentWeatherData.main.temp);
  const [time, setTime] = useState("");
  // const [tempUnit, setTempUnit] = useState("C");

  useEffect(() => {
    updateTime();
  }, []);

  const updateTime = () => {
    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(now);
    setTime(formattedTime);
  };

  return (
    <div className="text-center grid gap-2 justify-center">
      <p className="text-3xl font-bold">{currentWeatherData.name}</p>
      <div className="grid gap-1">
        <div className="flex items-center justify-center">
          <Image
            src={`http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
            alt="cloud image"
            width={75}
            height={75}
          />
          <p className="text-4xl">
            {localStorage.getItem("tempUnit") === "C"
              ? currentWeatherData.main.temp + "°C"
              : celciusToFahrenheit(currentWeatherData.main.temp) + "°F"}
          </p>
        </div>
        <p>{currentWeatherData.weather[0].description}</p>
        <p>
          Updated at <span className="font-bold">{time}</span>
        </p>
        <div className="flex justify-center gap-3">
          <p>
            L :{" "}
            {localStorage.getItem("tempUnit") === "C"
              ? currentWeatherData.main.temp_min + "°C"
              : celciusToFahrenheit(currentWeatherData.main.temp_min) + "°F"}
          </p>
          <p>
            H :{" "}
            {localStorage.getItem("tempUnit") === "C"
              ? currentWeatherData.main.temp_max + "°C"
              : celciusToFahrenheit(currentWeatherData.main.temp_max) + "°F"}
          </p>
        </div>
        <div className="flex gap-7">
          <p>
            Feels Like{" "}
            {localStorage.getItem("tempUnit") === "C"
              ? currentWeatherData.main.feels_like + "°C"
              : celciusToFahrenheit(currentWeatherData.main.feels_like) + "°F"}
          </p>
          <p>
            Wind{" "}
            {localStorage.getItem("windUnit") === "kmh"
              ? msToKmh(currentWeatherData.wind.speed) + " km/h"
              : msToMph(currentWeatherData.wind.speed) + " mph"}
          </p>
          <p>
            Visibility {(currentWeatherData.visibility / 1000).toFixed(2)} km
          </p>
        </div>
      </div>
    </div>
  );
}
