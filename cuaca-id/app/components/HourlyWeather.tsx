import Image from "next/image";
import { kelvinToCelsius } from "../lib/convert";

type WeatherItem = {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
};

type HourlyWeatherData = {
  list: WeatherItem[];
};

interface HourlyWeatherProps {
  hourlyWeatherData: HourlyWeatherData;
}

export default function HourlyWeather({
  hourlyWeatherData,
}: HourlyWeatherProps) {
  function formatTime(time: string) {
    const [hours, minutes] = time.split(":");
    const suffix = time.slice(-2);
    return minutes === "00"
      ? `${+hours} ${suffix}`
      : `${+hours}.${+minutes} ${suffix}`;
  }

  return (
    <div>
      <p>HOURLY FORECAST</p>
      <div className="mt-3 p-3 bg-primary/10 flex justify-around rounded-md">
        {hourlyWeatherData.list.slice(0, 5).map((item, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <p className="text-xs sm:text-base">
              {formatTime(new Date(item.dt * 1000).toLocaleTimeString())}
            </p>
            <Image
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="cloud image"
              width={50}
              height={50}
              className="bg-secondary/70 rounded-full"
            />
            <p className="text-xs sm:text-base">
              {kelvinToCelsius(item.main.temp)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
