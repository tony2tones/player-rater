import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.actions';
// Auth Reducer is a pure function just returns a new this.state.

export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.authStateChanged, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: !!user,
  })),
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    isLoggedIn: true,
    loading: false,
  })),
  on(AuthActions.loginFailed, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logoutSuccess, () => initialAuthState),
);
