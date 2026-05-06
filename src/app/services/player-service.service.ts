import { inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  docData,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, Observable } from 'rxjs';
import { PlayerProfileInterface } from '../interfaces/play-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  fireStore = inject(Firestore);
  playerCollection = collection(this.fireStore, 'players');
  currentPlayerSig = signal<PlayerProfileInterface | null>(null);
  players = toSignal(
    collectionData(this.playerCollection, { idField: 'id' }) as Observable<PlayerProfileInterface[]>,
    { initialValue: [] as PlayerProfileInterface[] }
  );

  getPlayers(): Observable<PlayerProfileInterface[]> {
    return collectionData(this.playerCollection, {
      idField: 'id',
    }) as Observable<PlayerProfileInterface[]>;
  }

  getPlayerById(id: string): Observable<PlayerProfileInterface> {
    const docRef = doc(this.fireStore, `players/${id}`);
    return docData(docRef, {
      idField: 'id',
    }) as Observable<PlayerProfileInterface>;
  }

  savePlayer(id: string, player: PlayerProfileInterface): Observable<void> {
    const docRef = doc(this.fireStore, `players/${id}`);
    return from(setDoc(docRef, player, { merge: true }));
  }
}
