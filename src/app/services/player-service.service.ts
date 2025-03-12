import { inject, Injectable, signal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlayerServiceService {
  fireStore = inject(Firestore);
  playerCollection = collection(this.fireStore,'players');
  playerSig = signal<UserInterface[]>([]);
 
    getPlayers():Observable<UserInterface[]> {
       return collectionData(this.playerCollection,{
         idField: 'id',
       }) as Observable<UserInterface[]>
     }

     addPlayer(player:UserInterface): Observable<string> {
      const promise = addDoc(this.playerCollection, player).then((docRef) => docRef.id);
    return from(promise);
     }
}
