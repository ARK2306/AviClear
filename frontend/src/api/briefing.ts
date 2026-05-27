import client from './client';
import type { BriefingResponse } from '../types';

export async function getBriefing(
  departure: string,
  destination: string,
  departureTime: string
): Promise<BriefingResponse> {
  const res = await client.post<BriefingResponse>('/api/briefing', {
    departure: departure.toUpperCase(),
    destination: destination.toUpperCase(),
    departureTime,
  });
  return res.data;
}
