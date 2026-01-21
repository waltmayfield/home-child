export async function fetchForecast(lat: number, lon: number) {
  const url = `/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Weather API error: ${res.status} ${text}`);
  }
  return res.json();
}
