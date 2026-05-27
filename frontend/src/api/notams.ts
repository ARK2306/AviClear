import client from './client';
import type { NotamBriefing } from '../types';

export async function classifyNotams(icao: string): Promise<NotamBriefing[]> {
  const res = await client.get<NotamBriefing[]>('/api/notam/classify', {
    params: { icao: icao.toUpperCase() },
  });
  return res.data;
}
