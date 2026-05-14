export interface PlayerProfileInterface {
  id?: string;
  fullName?: string;
  displayName: string;
  location: string;
  bio: string;
  experience?: string;
  position: string;
  photoUrl?: string;
  transport: string;
  isOrganiser?: boolean;
  ageRange?: string;
  availableForLeague?: boolean;
  gamesPlayed?: number;
  skills: Skills;
}

export interface Skills {
  speed: number | null;
  shooting: number | null;
  passing: number | null;
  defending: number | null;
  dribbling: number | null;
  goalkeeper: number | null;
  physical: number | null;
  mental: number | null;
  vision: number | null;
  playmaking: number | null;
}
