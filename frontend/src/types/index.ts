export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface CloudLayer {
  coverage: string;
  base: number;
}

export interface MetarResponse {
  icaoId: string;
  rawOb: string;
  temp: number | null;
  dewp: number | null;
  wdir: number | null;
  wspd: number | null;
  wgst: number | null;
  visib: number | null;
  altim: number | null;
  fltCat: 'VFR' | 'MVFR' | 'IFR' | 'LIFR' | string;
  name: string;
  clouds: CloudLayer[] | null;
}

export interface Notam {
  notamId: string;
  type: string;
  location: string;
  effective: string | null;
  expiration: string | null;
  body: string;
  raw: string;
}

export type NotamSeverity = 'CRITICAL' | 'SIGNIFICANT' | 'ROUTINE';

export interface NotamBriefing {
  notam: Notam;
  severity: NotamSeverity;
  summary: string;
}

export interface BriefingResponse {
  departure: string;
  destination: string;
  departureTime: string;
  departureMetar: MetarResponse | null;
  arrivalMetar: MetarResponse | null;
  departureNotams: NotamBriefing[];
  destinationNotams: NotamBriefing[];
  briefing: string;
}
