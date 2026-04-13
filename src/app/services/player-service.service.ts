import { inject, Injectable, signal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';
import { from, Observable } from 'rxjs';
import { PlayerProfileInterface } from '../interfaces/play-profile.interface';
import { playerProfileInterface } from '../features/dashboard/dashboard.component';


@Injectable({
  providedIn: 'root'
})
export class PlayerServiceService {
  fireStore = inject(Firestore);
  playerCollection = collection(this.fireStore,'players');
  // playerProfileCollection = collection(this.fireStore,`players/${id}`, );
  playerSig = signal<UserInterface[]>([]);
  playersSig = signal<playerProfileInterface[]>([]);
 
    getPlayers():Observable<playerProfileInterface[]> {
       return collectionData(this.playerCollection,{
         idField: 'id',
       }) as Observable<playerProfileInterface[]>
     }

    //  getPlayerProfile(): Observable<PlayerProfileInterface> {
    //   return collection(this.playerCollection)
    //  }

     addPlayer(player:PlayerProfileInterface): Observable<string> {
      const promise = addDoc(this.playerCollection, player).then((docRef) => docRef.id);
    return from(promise);
     }
}
