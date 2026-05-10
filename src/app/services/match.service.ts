import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  docData,
  doc,
  addDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { MatchInterface } from '../interfaces/match.interface';

@Injectable({ providedIn: 'root' })
export class MatchService {
  fireStore = inject(Firestore);
  matchCollection = collection(this.fireStore, 'matches');

  // Live signal — auto-updates when Firestore changes, same pattern as PlayerService.players
  matches = toSignal(
    collectionData(this.matchCollection, { idField: 'id' }) as Observable<
      MatchInterface[]
    >,
    { initialValue: [] as MatchInterface[] },
  );

  getMatchById(id: string): Observable<MatchInterface> {
    const docRef = doc(this.fireStore, `matches/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<MatchInterface>;
  }

  // addDoc lets Firestore generate the document ID automatically
  createMatch(match: MatchInterface): Observable<void> {
    return from(addDoc(this.matchCollection, match).then(() => void 0));
  }
}
