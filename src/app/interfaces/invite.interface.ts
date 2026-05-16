export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface InviteInterface {
  id?: string;
  matchId: string;
  matchDate: string;
  matchLocation: string;
  fromUserId: string;
  toUserId: string;
  status: InviteStatus;
  createdAt: string;
}
