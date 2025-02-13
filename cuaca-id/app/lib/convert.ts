export function kelvinToCelsius(k: number): string {
  return (k - 273.15).toFixed(2);
}

export function kelvinToFahrenheit(k: number): string {
  return ((k - 273.15) * (9 / 5) + 32).toFixed(2);
}

export function celciusToFahrenheit(c: number) {
  return ((c * 9) / 5 + 32).toFixed(2);
}

export function msToKmh(ms: number): string {
  return (ms * 3.6).toFixed(2);
}

export function msToMph(ms: number): string {
  return (ms * 2.23694).toFixed(2);
}
