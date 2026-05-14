import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-profile/:profileId',
    loadComponent: () =>
      import('./features/edit-profile/edit-profile.component').then(
        (m) => m.EditProfileComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./features/matches/matches.component').then(
        (m) => m.MatchesComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'match/:id',
    loadComponent: () =>
      import('./features/match-details/match-details.component').then(
        (m) => m.MatchDetailsComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-match',
    loadComponent: () =>
      import('./features/create-match/create-match.component').then(
        (m) => m.CreateMatchComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'match/:id/edit',
    loadComponent: () =>
      import('./features/create-match/create-match.component').then(
        (m) => m.CreateMatchComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'player-profile/:profileId',
    loadComponent: () =>
      import('./features/player-profile/player-profile.component').then(
        (m) => m.PlayerProfileComponent,
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  { path: '**', redirectTo: '/auth/login' },
];
