import { NextResponse } from 'next/server';
import { mapWeatherCode } from '../../../lib/weatherCodeMap';

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Missing lat/lon query parameters' }, { status: 400 });
    }

    const today = new Date();
    const start_date = formatDate(today);
    const end = new Date(today.getTime());
    end.setDate(end.getDate() + 13); // 14 days total
    const end_date = formatDate(end);

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&start_date=${start_date}&end_date=${end_date}`;

    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Upstream error', details: text }, { status: 502 });
    }

    const data = await res.json();

    const timezone = data.timezone || null;

    const daily = data.daily || {};
    const times: string[] = daily.time || [];
    const tempMax: number[] = daily.temperature_2m_max || [];
    const tempMin: number[] = daily.temperature_2m_min || [];
    const precipitation: number[] = daily.precipitation_sum || [];
    const weathercodes: number[] = daily.weathercode || [];

    const forecast = times.map((date: string, i: number) => ({
      date,
      temp_max_c: tempMax[i] ?? null,
      temp_min_c: tempMin[i] ?? null,
      precipitation_mm: precipitation[i] ?? 0,
      weather_code: typeof weathercodes[i] === 'number' ? weathercodes[i] : null,
      weather_description: mapWeatherCode(weathercodes[i])
    }));

    const payload = {
      provider: 'open-meteo',
      timezone,
      location: {
        latitude: Number(lat),
        longitude: Number(lon),
        name: null
      },
      forecast
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}
