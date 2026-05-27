import client from './client';
import type { MetarResponse } from '../types';

export async function getMetar(icao: string): Promise<MetarResponse> {
  const res = await client.get<MetarResponse>('/api/weather/metar', {
    params: { icao: icao.toUpperCase() },
  });
  return res.data;
}

export async function translateMetar(icao: string): Promise<string> {
  const res = await client.get<string>('/api/weather/metar/translate', {
    params: { icao: icao.toUpperCase() },
  });
  return res.data;
}
