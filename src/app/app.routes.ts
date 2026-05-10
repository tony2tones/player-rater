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
