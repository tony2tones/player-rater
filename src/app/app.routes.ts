import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CreateProfileComponent } from './features/create-profile/create-profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-profile/:profileId',
    component: CreateProfileComponent,
    canActivate:[AuthGuardService],
  },
{
  path: 'auth/login',
  component: LoginComponent,
},
{
  path: 'auth/register',
  component: RegisterComponent,
},
{path: '**', redirectTo: '/auth/login'}
];
