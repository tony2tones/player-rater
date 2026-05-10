import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';
import { stat } from 'fs';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectAllPlayers = createSelector(
  selectPlayerState,
  (state) => state.players,
);

export const selectSelectedPlayer = createSelector(
  selectPlayerState,
  (state) => state.selectedPlayer,
);

export const selectPlayerLoading = createSelector(
  selectPlayerState,
  (state) => state.loading,
);

export const selectPlayerError = createSelector(
  selectPlayerState,
  (state) => state.error,
);
