import Image from "next/image";
import { celciusToFahrenheit } from "../lib/convert";

type WeatherItem = {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

type DailyWeatherData = {
  list: WeatherItem[];
};

interface DailyWeatherProps {
  dailyWeatherData: DailyWeatherData;
}

export default function DailyWeather({ dailyWeatherData }: DailyWeatherProps) {
  function formatDate(d: string | number | Date) {
    const date = new Date(d);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    const options: Intl.DateTimeFormatOptions = { weekday: "short" };
    const day = date.getDate();
    const weekday = new Intl.DateTimeFormat("en-US", options).format(date);
    return (
      <>
        {weekday} {day}
      </>
    );
  }

  return (
    <div className="mt-3">
      <p className="text-lg">Daily Forecast</p>
      <div className="mt-3 flex gap-3 justify-center">
        {dailyWeatherData.list.map(
          (item, index) =>
            item.dt_txt.split(" ")[1] === "00:00:00" && (
              <div
                key={index}
                className="flex flex-col justify-between bg-secondary rounded-md p-3 w-full"
              >
                <p className="text-xs sm:text-base">
                  {formatDate(item.dt_txt.split(" ")[0])}
                </p>
                <Image
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="cloud image"
                  width={50}
                  height={50}
                />
                <p className="text-xs sm:text-base">
                  {item.weather[0].description}
                </p>
                <p className="text-xs sm:text-base">
                  {localStorage.getItem("tempUnit") === "C"
                    ? item.main.temp + "°C"
                    : celciusToFahrenheit(item.main.temp) + "°F"}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
}
