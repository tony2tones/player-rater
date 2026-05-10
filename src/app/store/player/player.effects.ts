import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Inject, inject, Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import * as PlayerActions from './player.actions';
import { PlayerService } from '../../services/player-service.service';

@Injectable()
export class PlayerEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private playerService = inject(PlayerService);

  loadPlayers$ = this.actions$.pipe(
    ofType(PlayerActions.loadPlayers),
    switchMap(() =>
      this.playerService.getPlayers().pipe(
        map((players) => PlayerActions.loadPlayersSuccess({ players })),
        catchError((error) =>
          of(PlayerActions.loadPlayerFailed({ error: error.message })),
        ),
      ),
    ),
  );

  loadPlayer = this.actions$.pipe(
    ofType(PlayerActions.loadPlayer),
    switchMap(({ id }) =>
      this.playerService.getPlayerById(id).pipe(
        map(
          (player) => PlayerActions.loadPlayerSuccess({ player }),
          catchError((error) =>
            of(PlayerActions.loadPlayerFailed({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  savePlayer$ = this.actions$.pipe(
    ofType(PlayerActions.savePlayer),
    switchMap(({ id, player }) =>
      this.playerService.savePlayer(id, player).pipe(
        map(() => PlayerActions.savePlayerSuccess()),
        catchError((error) =>
          of(PlayerActions.savePlayerFailed({ error: error.message })),
        ),
      ),
    ),
  );
}
