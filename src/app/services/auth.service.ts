import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of, tap } from 'rxjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const HAS_AUTHED_STORAGE_KEY = btoa('hasAuthed');

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
    return from(promise).pipe(tap({
      next: () => localStorage.setItem(HAS_AUTHED_STORAGE_KEY, 'true'),
    }))
  }

  
  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(!!user);
        observer.complete();
      })
    })
  }

  terminateSessionAndRedirect(): void {
    // clear state on logout
    this.clearAuthStatus();
    // this.router.navigate(['auth', 'login']);
  }

  // Logout function
  public async logout() {
    try {
      await this.auth.signOut();
      this.terminateSessionAndRedirect();
      this.router.navigate(['/auth/login']); // Navigate to login page on logout
      console.log('User logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  clearAuthStatus() {
    localStorage.removeItem(HAS_AUTHED_STORAGE_KEY);
  }

  hasAuthed(): Observable<string | null> {
    return of(localStorage.getItem(HAS_AUTHED_STORAGE_KEY));
  }
}
