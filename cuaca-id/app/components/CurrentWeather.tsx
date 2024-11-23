import { useEffect, useState } from "react";
import { kelvinToCelsius } from "../lib/convert";
import Image from "next/image";

export default function CurrentWeather({
  currentWeatherData,
}: // clientData,
any) {
  const [temp, setTemp] = useState(currentWeatherData.main.temp);
  const [time, setTime] = useState("");
  const [tempUnit, setTempUnit] = useState("C");

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
      <p className="text-xl">
        {currentWeatherData.name} {/* {clientData.location.region.name} */}
      </p>
      <div className="grid gap-1">
        <div className="flex items-center justify-center">
          <Image
            src={`http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
            alt="cloud image"
            width={75}
            height={75}
          />
          <p className="text-4xl">
            {kelvinToCelsius(currentWeatherData.main.temp)}°
          </p>
        </div>
        <p>{currentWeatherData.weather[0].description}</p>
        <p>
          Updated at <span className="font-bold">{time}</span>
        </p>
        <div className="flex justify-center gap-3">
          <p>L : {kelvinToCelsius(currentWeatherData.main.temp_min)}</p>
          <p>H : {kelvinToCelsius(currentWeatherData.main.temp_max)}</p>
        </div>
        <div className="flex gap-7">
          <p>
            Feels Like {kelvinToCelsius(currentWeatherData.main.feels_like)}°
          </p>
          <p>Wind {(currentWeatherData.wind.speed * 3.6).toFixed(2)} km/h</p>
          <p>
            Visibility {(currentWeatherData.visibility / 1000).toFixed(2)} km
          </p>
        </div>
      </div>
    </div>
  );
}
