import { inject, Injectable, Signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user, User, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Signal to hold the authenticated user
  public user: Signal<User | null |undefined> = toSignal(user(this.auth));

  constructor() {
    // Optionally, listen to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // You can handle the user state change here if needed
        console.log('User logged in:', user);
      } else {
        // Handle user logout
        console.log('User logged out');
      }
    });
  }

  // Login function with email and password
  public async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      // After successful login, you can route to another page (e.g., dashboard)
      this.router.navigate(['/dashboard']); // Change to your desired route
      console.log('User logged in successfully:', userCredential.user);
    } catch (error) {
      // Handle login errors here (e.g., incorrect credentials)
      console.error('Login failed:', error);
      // Return an observable with the error so the caller can handle it
      return of(error);
    }
  }

  // Logout function
  public async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']); // Navigate to login page on logout
      console.log('User logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
