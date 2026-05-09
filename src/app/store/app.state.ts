import { AuthState } from './auth/auth.reducer';
// import { PlayerState } from './player/player.reducer';

export interface AppState {
  auth: AuthState;
  // player: PlayerState;
}
