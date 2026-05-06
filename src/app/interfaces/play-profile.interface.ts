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
  skills: {
    speed: number | null;
    shooting: number | null;
    passing: number | null;
    defending: number | null;
    physical: number | null;
    mental: number | null;
  };
}
