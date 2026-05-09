import { createAction, props } from '@ngrx/store';
import { PlayerProfileComponent } from '../../features/player-profile/player-profile.component';
// import PlayerProfileInterface from '../../interfaces/play-profile.interface';

type PlayerProfileInterface = {
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
};

export const loadPlayers = createAction('[Player] Load Players');

export const loadPlayersSuccess = createAction(
  '[Player] "Load Successful',
  props<{ players: PlayerProfileInterface[] }>(),
);

export const loadPlayersFailed = createAction(
  '[Player] Load Players Failed',
  props<{ error: string }>(),
);

export const loadPlayer = createAction(
  '[Player] Load Player',
  props<{ id: string }>(),
);

export const loadPlayerSuccess = createAction(
  '[Player] Load Player Successful',
  props<{ player: PlayerProfileInterface }>(),
);

export const loadPlayerFailed = createAction(
  '[Player] Load Player Failed',
  props<{ error: string }>(),
);
