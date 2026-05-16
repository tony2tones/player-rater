import { computed, inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  docData,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, map, Observable } from 'rxjs';
import { PlayerProfileInterface } from '../interfaces/play-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  fireStore = inject(Firestore);
  private auth = inject(Auth);

  playerCollection = collection(this.fireStore, 'players');

  // Live signal — auto-updates when the players collection changes
  players = toSignal(
    collectionData(this.playerCollection, { idField: 'id' }) as Observable<PlayerProfileInterface[]>,
    { initialValue: [] as PlayerProfileInterface[] },
  );

  // Derives the current player profile directly from the live players signal.
  // Stays in sync with Firestore automatically — no manual .set() needed anywhere.
  private currentUid = toSignal(
    authState(this.auth).pipe(map((user) => user?.uid ?? null)),
    { initialValue: null },
  );

  currentPlayerSig = computed<PlayerProfileInterface | null>(() => {
    const uid = this.currentUid();
    if (!uid) return null;
    return this.players().find((p) => p.id === uid) ?? null;
  });

  getPlayers(): Observable<PlayerProfileInterface[]> {
    return collectionData(this.playerCollection, { idField: 'id' }) as Observable<PlayerProfileInterface[]>;
  }

  getPlayerById(id: string): Observable<PlayerProfileInterface> {
    const docRef = doc(this.fireStore, `players/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<PlayerProfileInterface>;
  }

  savePlayer(id: string, player: PlayerProfileInterface): Observable<void> {
    const docRef = doc(this.fireStore, `players/${id}`);
    return from(setDoc(docRef, player, { merge: true }));
  }
}
