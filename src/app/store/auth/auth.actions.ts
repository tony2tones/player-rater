import { createAction, props } from '@ngrx/store';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const authStateChanged = createAction(
  '[Auth] State Changed',
  props<{ user: AuthUser | null }>(),
);
export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser }>(),
);

export const loginFailed = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

export const logoutRequest = createAction('[Auth], Logout Requested');
export const logoutSuccess = createAction('[Auth], Logout Success');
