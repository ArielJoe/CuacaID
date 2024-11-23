export function kelvinToCelsius(k: number): string {
  return (k - 273.15).toFixed(2);
}

export function kelvinToFahrenheit(k: number): string {
  return ((k - 273.15) * (9 / 5) + 32).toFixed(2);
}
