import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  docData,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, Observable, of, switchMap } from 'rxjs';
import { InviteInterface } from '../interfaces/invite.interface';

@Injectable({ providedIn: 'root' })
export class InviteService {
  private fireStore = inject(Firestore);
  private auth = inject(Auth);

  private inviteCollection = collection(this.fireStore, 'invites');

  // Real-time signal of pending invites for the logged-in user
  pendingInvites = toSignal(
    authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) return of([] as InviteInterface[]);
        const q = query(
          this.inviteCollection,
          where('toUserId', '==', user.uid),
          where('status', '==', 'pending'),
        );
        return collectionData(q, { idField: 'id' }) as Observable<InviteInterface[]>;
      }),
    ),
    { initialValue: [] as InviteInterface[] },
  );

  // Real-time observable of the current user's invite for a specific match.
  // Document ID is compound: `${matchId}_${uid}` — avoids duplicate invites naturally.
  getInviteForMatch(matchId: string): Observable<InviteInterface | undefined> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return of(undefined);
    const inviteRef = doc(this.fireStore, `invites/${matchId}_${uid}`);
    return docData(inviteRef, { idField: 'id' }) as Observable<InviteInterface | undefined>;
  }

  // Creates invite documents for each toUserId. Skips if an invite already exists
  // so re-submitting an edit doesn't spam the player.
  sendInvites(
    matchId: string,
    matchDate: string,
    matchLocation: string,
    fromUserId: string,
    toUserIds: string[],
  ): Observable<void> {
    const sends = toUserIds.map(async (toUserId) => {
      const id = `${matchId}_${toUserId}`;
      const inviteRef = doc(this.fireStore, `invites/${id}`);
      const snap = await getDoc(inviteRef);
      if (!snap.exists()) {
        await setDoc(inviteRef, {
          matchId,
          matchDate,
          matchLocation,
          fromUserId,
          toUserId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    });
    return from(Promise.all(sends).then(() => void 0));
  }

  // Marks the invite accepted and atomically adds the player to the match's playerIds
  acceptInvite(invite: InviteInterface): Observable<void> {
    const inviteRef = doc(this.fireStore, `invites/${invite.id}`);
    const matchRef = doc(this.fireStore, `matches/${invite.matchId}`);
    return from(
      Promise.all([
        updateDoc(inviteRef, { status: 'accepted' }),
        updateDoc(matchRef, { playerIds: arrayUnion(invite.toUserId) }),
      ]).then(() => void 0),
    );
  }

  declineInvite(invite: InviteInterface): Observable<void> {
    const inviteRef = doc(this.fireStore, `invites/${invite.id}`);
    return from(updateDoc(inviteRef, { status: 'declined' }).then(() => void 0));
  }
}
