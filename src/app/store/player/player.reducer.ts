import { createReducer, on } from '@ngrx/store';
import * as PlayerActions from './player.actions';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';
import { stateChanges } from '@angular/fire/compat/database';

export interface PlayerState {
  players: PlayerProfileInterface[];
  selectedPlayer: PlayerProfileInterface | null;
  loading: boolean;
  error: string | null;
}

export const initialPlayerState: PlayerState = {
  players: [],
  selectedPlayer: null,
  loading: false,
  error: null,
};

export const playerReducer = createReducer(
  initialPlayerState,
  on(PlayerActions.loadPlayers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PlayerActions.loadPlayersSuccess, (state, { players }) => ({
    ...state,
    players,
    loading: false,
  })),
  on(PlayerActions.loadPlayersFailed, (state) => ({
    ...state,
    loading: false,
  })),
  on(PlayerActions.loadPlayer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PlayerActions.loadPlayerSuccess, (state, { player }) => ({
    ...state,
    selectedPlayer: player,
    loading: false,
  })),
  on(PlayerActions.loadPlayerFailed, (state) => ({ ...state, loading: false })),

  on(PlayerActions.savePlayer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PlayerActions.savePlayerSuccess, (state) => ({
    ...state,
    loading: false,
  })),
);
