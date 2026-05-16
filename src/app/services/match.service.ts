import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  docData,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
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

  // addDoc lets Firestore generate the document ID automatically; returns the new ID
  // so callers can send invites referencing the correct matchId.
  createMatch(match: MatchInterface): Observable<string> {
    return from(addDoc(this.matchCollection, match).then((ref) => ref.id));
  }

  updateMatch(id: string, payload: Partial<MatchInterface>): Observable<void> {
    const docRef = doc(this.fireStore, `matches/${id}`);
    return from(updateDoc(docRef, { ...payload }).then(() => void 0));
  }

  requestToJoin(matchId: string, userId: string): Observable<void> {
    const docRef = doc(this.fireStore, `matches/${matchId}`);
    return from(updateDoc(docRef, { requestIds: arrayUnion(userId) }).then(() => void 0));
  }

  approveJoinRequest(matchId: string, userId: string): Observable<void> {
    const docRef = doc(this.fireStore, `matches/${matchId}`);
    return from(
      updateDoc(docRef, {
        playerIds: arrayUnion(userId),
        requestIds: arrayRemove(userId),
      }).then(() => void 0),
    );
  }

  denyJoinRequest(matchId: string, userId: string): Observable<void> {
    const docRef = doc(this.fireStore, `matches/${matchId}`);
    return from(updateDoc(docRef, { requestIds: arrayRemove(userId) }).then(() => void 0));
  }
}
