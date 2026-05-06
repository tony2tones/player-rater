import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { PlayerService } from './player-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);
  playerService = inject(PlayerService);
  injector = inject(Injector);

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.firebaseAuth.onAuthStateChanged((user) => {
      this.isLoggedInSubject.next(!!user);
      if (user) {
        runInInjectionContext(this.injector, () => {
          this.playerService.getPlayerById(user.uid).subscribe((player) => {
            this.playerService.currentPlayerSig.set(player);
          });
        });
      } else {
        this.playerService.currentPlayerSig.set(null);
      }
    });
  }

  checkUsername(username: string): Observable<boolean> {
    const usernameDoc = doc(this.firestore, `usernames/${username}`);
    return from(getDoc(usernameDoc).then((snapShot) => snapShot.exists()));
  }

  register(
    email: string,
    username: string,
    password: string,
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((response) => {
      return updateProfile(response.user, { displayName: username }).then(() =>
        setDoc(doc(this.firestore, `usernames/${username}`), {
          uid: response.user.uid,
        }),
      );
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => {});
    return from(promise);
  }

  logout = async () => {
    await this.firebaseAuth.signOut();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  };
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return of(this.firebaseAuth.currentUser);
  }
}
