"use client";

import { redirect } from "next/navigation";
import { requireUser } from "../lib/hooks";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import CurrentWeather from "../components/CurrentWeather";
import HourlyWeather from "../components/HourlyWeather";
import DailyWeather from "../components/DailyWeather";
import CitiesWeather from "../components/CitiesWeather";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Bandung");
  const [currentWeatherData, setCurrentWeatherData] = useState({});
  const [hourlyWeatherData, setHourlyWeatherData] = useState({});
  const [clientData, setClientData] = useState({});
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  useEffect(() => {
    const fetchData = async () => {
      const session = await requireUser();
      if (!session?.user) {
        redirect("/");
      }

      fetchWeatherAndClient();
    };

    fetchData();
  }, []);

  const fetchWeatherAndClient = async () => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const hourlyWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    // const ipRegistry = `https://api.ipregistry.co/?key=ira_zMf2obt3eWEg710UASqpuOBPak2XPE3FxGbW`;

    try {
      const currentWeather = await axios.get(currentWeatherUrl);
      const hourlyWeather = await axios.get(hourlyWeatherUrl);
      // const client = await axios.get(ipRegistry);
      setCurrentWeatherData(currentWeather.data);
      setHourlyWeatherData(hourlyWeather.data);
      // setClientData(client.data);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Data not found",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="size-4 mr-2 animate-spin" />
        Fetching current weathers data...
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-y-2">
        <div className="flex rounded-md">
          <span className="inline-flex items-center rounded-l-full px-3 border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
            <button onClick={fetchWeatherAndClient}>
              <Search />
            </button>
          </span>
          <Input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchWeatherAndClient();
              }
            }}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city"
            className="rounded-l-none rounded-r-full"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="flex flex-col justify-center gap-2 bg-secondary p-6 w-full md:w-[60%] rounded-md">
          <CurrentWeather
            currentWeatherData={currentWeatherData}
            // clientData={clientData}
          />
          <HourlyWeather hourlyWeatherData={hourlyWeatherData} />
          <DailyWeather dailyWeatherData={hourlyWeatherData} />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-[40%]">
          <CitiesWeather />
        </div>
      </div>
    </>
  );
}
