import { createAction, props } from '@ngrx/store';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';

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

export const savePlayer = createAction(
  '[Player] Save Player',
  props<{ id: string; player: PlayerProfileInterface }>(),
);

export const savePlayerSuccess = createAction(
  '[Player] Save Player Successful',
);

export const savePlayerFailed = createAction(
  '[Player] Save Failed',
  props<{ error: string }>(),
);
