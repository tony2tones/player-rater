import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Signal to hold the authenticated user
   register(email:string, username:string, password:string): Observable<void> {
 const promise = createUserWithEmailAndPassword(this.auth, email, password)
 .then((response) => {
   return updateProfile(response.user, {displayName: username});
  });
  return from(promise).pipe();
}

 login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then(() => {})
    return from(promise)
  }

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
