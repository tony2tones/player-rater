import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    // Access the user signal from AuthService
    const user = this.authService.user();
    
    if (user) {
      return true; // Allow access if user is authenticated
    } else {
      return this.router.createUrlTree(['/login']); // Redirect to login page
    }
  }
}
