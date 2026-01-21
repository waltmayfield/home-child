export function mapWeatherCode(code: number | undefined | null): string {
  if (code === null || code === undefined) return 'Unknown';
  const c = Number(code);
  // Based on Open-Meteo weather codes
  if (c === 0) return 'Clear sky';
  if (c === 1) return 'Mainly clear';
  if (c === 2) return 'Partly cloudy';
  if (c === 3) return 'Overcast';
  if (c === 45 || c === 48) return 'Fog';
  if (c === 51 || c === 53 || c === 55) return 'Drizzle';
  if (c === 56 || c === 57) return 'Freezing Drizzle';
  if (c === 61 || c === 63 || c === 65) return 'Rain';
  if (c === 66 || c === 67) return 'Freezing Rain';
  if (c === 71 || c === 73 || c === 75) return 'Snow';
  if (c === 77) return 'Snow grains';
  if (c === 80 || c === 81 || c === 82) return 'Rain showers';
  if (c === 85 || c === 86) return 'Snow showers';
  if (c === 95 || c === 96 || c === 99) return 'Thunderstorm';
  return 'Unknown';
}
