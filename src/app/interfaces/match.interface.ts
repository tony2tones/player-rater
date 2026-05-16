export interface MatchInterface {
  id?: string;
  date: string;
  location: string;
  playerIds: string[];
  requestIds?: string[];
  result?: string;
  manOfTheMatchId?: string;
  organiserId: string;
  createdAt: string;
}
