"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "../lib/hooks";
import { deleteSchedule, getSchedule } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { celciusToFahrenheit } from "../lib/convert";

interface Schedule {
  id: string;
  title: string;
  description: string;
  day: string;
  startTime: string;
  endTime: string;
}

type HourlyWeatherData = {
  list: {
    dt: number;
    dt_txt: string;
    main: { temp: number };
    weather: { description: string; icon: string }[];
  }[];
};

export function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [hourlyWeatherData, setHourlyWeatherData] =
    useState<HourlyWeatherData | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchWeatherAndClient();
  }, []);

  async function fetchSchedules() {
    try {
      const session = await requireUser();
      const userId = session.user?.id;
      const schedule = await getSchedule(userId!);
      setSchedules(schedule);
    } finally {
      setLoading(false);
    }
  }

  const fetchWeatherAndClient = async () => {
    const ipRegistry = `https://api.ipregistry.co/?key=ira_zMf2obt3eWEg710UASqpuOBPak2XPE3FxGbW`;
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

    try {
      let detectedCity = "";
      if (city === "") {
        const ipRegistryResponse = await axios.get(ipRegistry);
        detectedCity = ipRegistryResponse.data.location.city;
        setCity(detectedCity);
      } else {
        detectedCity = city;
      }

      const hourlyWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${detectedCity}&appid=${API_KEY}&units=metric`;

      const [hourlyWeather] = await Promise.all([
        axios.get<HourlyWeatherData>(hourlyWeatherUrl),
      ]);

      setHourlyWeatherData(hourlyWeather.data);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Data not found, please try again.",
      });
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    console.log(event);
    await deleteSchedule(id);
  };

  const handleDayClick = async (day: Date) => {
    const detectedSchedules = schedules.filter((schedule) => {
      return schedule.day === day.toDateString();
    });

    return detectedSchedules;
  };

  const onDayClick = async (day: Date) => {
    const matchedSchedules = await handleDayClick(day);

    if (matchedSchedules.length > 0) {
      toast({
        title: `Your schedule on ${day.toDateString()}`,
        description: (
          <div className="mt-3">
            {matchedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex justify-between bg-secondary/80 rounded-md py-3 px-4 mb-3 w-[125%]"
              >
                <div className="flex flex-col gap-3">
                  <p>{schedule.title}</p>
                  <p>{schedule.description}</p>
                  <p>{schedule.day}</p>
                  <p>
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                </div>

                <div className="flex flex-col place-items-end">
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="p-3 bg-primary">
                          <Trash2 />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Deletion</DialogTitle>
                        </DialogHeader>
                        Delete this schedule?
                        <div className="grid gap-2 border border-secondary rounded-md p-3">
                          <p>{schedule.title}</p>
                          <p>{schedule.description}</p>
                          <p>{schedule.day}</p>
                          <p>
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                        <DialogFooter>
                          <form
                            onSubmit={(event) =>
                              handleSubmit(event, schedule.id)
                            }
                          >
                            <Button type="submit" className="flex w-full">
                              Delete
                            </Button>
                          </form>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="mt-4">
                    {searchWeather(schedule.day, schedule.startTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ),
      });
    } else {
      toast({
        title: `No schedules found on ${day.toDateString()}`,
        description: "You have no events scheduled for this day.",
      });
    }
  };

  function searchWeather(day: string, startTime: string) {
    if (!hourlyWeatherData) {
      return (
        <div className="flex justify-center items-center">
          <Loader2 className="size-4 mr-2 animate-spin" />
        </div>
      );
    }

    const start = new Date(`${day} ${startTime}`);

    for (let i = 0; i < hourlyWeatherData.list.length - 1; i++) {
      const currentEntryTime = new Date(hourlyWeatherData.list[i].dt_txt);
      const nextEntryTime = new Date(hourlyWeatherData.list[i + 1].dt_txt);

      if (start >= currentEntryTime && start < nextEntryTime) {
        return (
          <div className="flex flex-col items-center">
            <Image
              src={`http://openweathermap.org/img/wn/${hourlyWeatherData.list[i].weather[0].icon}@2x.png`}
              alt="cloud image"
              width={60}
              height={60}
            />
            <p>{hourlyWeatherData.list[i].weather[0].description}</p>
            <p>
              {localStorage.getItem("tempUnit") === "C"
                ? hourlyWeatherData.list[i].main.temp + "°C"
                : celciusToFahrenheit(hourlyWeatherData.list[i].main.temp) +
                  "°F"}
            </p>
          </div>
        );
      }
    }

    return (
      <p>
        No Weather
        <br />
        Data Found
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="size-4 mr-2 animate-spin" />
        Fetching schedules data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row w-full">
      <div className="w-full sm:w-[40%]">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex justify-between bg-secondary/80 rounded-md py-3 px-4 mb-3"
            >
              <div className="flex flex-col gap-3">
                <p>{schedule.title}</p>
                <p>{schedule.description}</p>
                <p>{schedule.day}</p>
                <p>
                  {schedule.startTime} - {schedule.endTime}
                </p>
              </div>

              <div className="flex flex-col place-items-end">
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="p-3 bg-primary">
                        <Trash2 />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Schedule Deletion</DialogTitle>
                      </DialogHeader>
                      Delete this schedule?
                      <div className="grid gap-2 border border-secondary rounded-md p-3">
                        <p>{schedule.title}</p>
                        <p>{schedule.description}</p>
                        <p>{schedule.day}</p>
                        <p>
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                      <DialogFooter>
                        <form
                          onSubmit={(event) => handleSubmit(event, schedule.id)}
                        >
                          <Button type="submit" className="flex w-full">
                            Delete
                          </Button>
                        </form>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-4">
                  {searchWeather(schedule.day, schedule.startTime)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Schedules Found</p>
        )}
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border w-full sm:w-[60%]"
        onDayClick={onDayClick}
      />
    </div>
  );
}
