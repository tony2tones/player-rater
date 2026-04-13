export interface PlayerProfileInterface {
  id?: string; // Optional, since Firebase generates an ID
  displayName: string;
  location: string;
  bio: string;
  position: string;
  photoUrl?: string; // Optional field
  transport: string;
  skills: {
    speed: number | null;
    shooting: number | null;
    passing: number | null;
    defending: number | null;
    physical: number | null;
    mental: number | null;
  };
}