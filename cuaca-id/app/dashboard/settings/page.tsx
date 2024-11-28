"use client";

import SettingsForm from "@/app/components/SettingsForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function SettingsRoute() {
  const [tempUnit, setTempUnit] = useState(
    localStorage.getItem("tempUnit") || "C"
  );
  const [windUnit, setWindUnit] = useState(
    localStorage.getItem("windUnit") || "kmh"
  );

  useEffect(() => {
    if (!localStorage.getItem("tempUnit")) {
      localStorage.setItem("tempUnit", "C");
    }
    if (!localStorage.getItem("windUnit")) {
      localStorage.setItem("windUnit", "kmh");
    }
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="w-full sm:w-[60%]">
        <SettingsForm />
      </div>
      <div className="border border-secondary rounded-lg p-6 w-full sm:w-[40%]">
        <h2 className="text-2xl font-bold mb-3">Units</h2>
        <div className="grid gap-3">
          <div className="flex justify-between items-center bg-secondary/50 rounded-md p-3">
            <div>Temperature</div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-primary text-secondary hover:bg-secondary"
                  >
                    {tempUnit}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("tempUnit", "C");
                      setTempUnit("C");
                    }}
                  >
                    C
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("tempUnit", "F");
                      setTempUnit("F");
                    }}
                  >
                    F
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex justify-between items-center bg-secondary/50 rounded-md p-3">
            <div>Wind Speed</div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-primary text-secondary hover:bg-secondary"
                  >
                    {windUnit?.replace("kmh", "km/h")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("windUnit", "kmh");
                      setWindUnit("kmh");
                    }}
                  >
                    km/h
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.setItem("windUnit", "mph");
                      setWindUnit("mph");
                    }}
                  >
                    mph
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
