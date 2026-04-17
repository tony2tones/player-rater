import { inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  docData,
  doc,
} from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';
import { from, Observable } from 'rxjs';
import { PlayerProfileInterface } from '../interfaces/play-profile.interface';
import { playerProfileInterface } from '../features/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  fireStore = inject(Firestore);
  playerCollection = collection(this.fireStore, 'players');
  // playerProfileCollection = collection(this.fireStore,`players/${id}`, );
  playerSig = signal<UserInterface[]>([]);
  playersSig = signal<playerProfileInterface[]>([]);

  getPlayers(): Observable<playerProfileInterface[]> {
    return collectionData(this.playerCollection, {
      idField: 'id',
    }) as Observable<playerProfileInterface[]>;
  }

  getPlayerById(id: string): Observable<playerProfileInterface> {
    const docRef = doc(this.fireStore, `players/${id}`);
    return docData(docRef, {
      idField: 'id',
    }) as Observable<playerProfileInterface>;
  }

  addPlayer(player: PlayerProfileInterface): Observable<string> {
    const promise = addDoc(this.playerCollection, player).then(
      (docRef) => docRef.id,
    );
    return from(promise);
  }
}
