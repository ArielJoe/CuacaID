import Image from "next/image";
import { kelvinToCelsius } from "../lib/convert";

export default function DailyWeather({ dailyWeatherData }: any) {
  function formatDate(d: string | number | Date): string {
    const date = new Date(d);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    const options: Intl.DateTimeFormatOptions = { weekday: "short" };
    const day = date.getDate();
    const weekday = new Intl.DateTimeFormat("en-US", options).format(date);
    return `${weekday} ${day}`;
  }

  return (
    <div className="mt-3">
      <p>DAILY FORECAST</p>
      <div className="mt-3 flex gap-3 justify-center">
        {dailyWeatherData.list.map(
          (item: any, index: number) =>
            item.dt_txt.split(" ")[1] === "00:00:00" && (
              <div
                key={index}
                className="grid gap-2 bg-primary/10 rounded-md p-3 w-full"
              >
                <p className="text-xs sm:text-base">
                  {formatDate(item.dt_txt.split(" ")[0])}
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
            )
        )}
      </div>
    </div>
  );
}