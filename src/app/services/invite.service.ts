import { computed, inject, Injectable } from '@angular/core';
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

  // All invites sent to the current user, newest first (client-side sort)
  allInvites = toSignal(
    authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) return of([] as InviteInterface[]);
        const q = query(
          this.inviteCollection,
          where('toUserId', '==', user.uid),
        );
        return collectionData(q, { idField: 'id' }) as Observable<InviteInterface[]>;
      }),
    ),
    { initialValue: [] as InviteInterface[] },
  );

  // Badge count — only pending invites need user action
  pendingCount = computed(() =>
    this.allInvites().filter((i) => i.status === 'pending').length,
  );

  // Real-time observable of the current user's invite for a specific match.
  // Compound document ID (matchId_uid) prevents duplicate invites per match per user.
  getInviteForMatch(matchId: string): Observable<InviteInterface | undefined> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return of(undefined);
    const ref = doc(this.fireStore, `invites/${matchId}_${uid}`);
    return docData(ref, { idField: 'id' }) as Observable<InviteInterface | undefined>;
  }

  // Creates invite documents only if one does not already exist for that match+player pair
  sendInvites(
    matchId: string,
    matchDate: string,
    matchLocation: string,
    fromUserId: string,
    toUserIds: string[],
  ): Observable<void> {
    const sends = toUserIds.map(async (toUserId) => {
      const id = `${matchId}_${toUserId}`;
      const ref = doc(this.fireStore, `invites/${id}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
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

  // Marks accepted and atomically adds the player to the match's playerIds
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
    const ref = doc(this.fireStore, `invites/${invite.id}`);
    return from(updateDoc(ref, { status: 'declined' }).then(() => void 0));
  }
}
