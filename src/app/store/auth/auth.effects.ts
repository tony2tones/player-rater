// ask why Actions is with a capital
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  // immutable variables
  private action$ = inject(Actions);
  private auth = inject(Auth);
  private router = inject(Router);

  authState$ = createEffect(
    () =>
      new Observable<Action>((observer) => {
        onAuthStateChanged(this.auth, (user) => {
          const serializedUser = user
            ? { uid: user.uid, email: user.email, displayName: user.displayName }
            : null;
          observer.next(AuthActions.authStateChanged({ user: serializedUser }));
        });
      }),
  );

  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.loginRequest),
      tap(() => console.log('Login request received')),
      switchMap(({ email, password }) =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
          map(({ user }) => AuthActions.loginSuccess({
            user: { uid: user.uid, email: user.email, displayName: user.displayName },
          })),
          catchError((error) => {
            console.error('Login error type:', error?.constructor?.name);
            console.error('Login error code:', error?.code);
            console.error('Login error message:', error?.message);
            console.error('Full error:', error);
            return of(AuthActions.loginFailed({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        tap(() => console.log('Login successful, navigating to dashboard')),
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.logoutRequest),
      switchMap(() =>
        from(signOut(this.auth)).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
  );
}
