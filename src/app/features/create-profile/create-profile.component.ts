import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlayerServiceService } from '../../services/player-service.service';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule, CardComponent],
  standalone: true,
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
  firebaseAuth = inject(Auth);
  playerService = inject(PlayerServiceService);
fb = inject(FormBuilder);
params = inject(ActivatedRoute);
profileId: string | null = null;
displayName: string | null = null;

constructor() {
  this.profileId = this.params.snapshot.paramMap.get('profileId');
  const displayNameResult = this.firebaseAuth.currentUser?.displayName;
  if(displayNameResult) {
    this.displayName = displayNameResult;
  }
}

createProfileForm = this.fb.group({
  displayName: [this.displayName ?? ''],
  location: [''],
  bio: [''],
  experience: [''],
  speed: [''],
  shooting: [''],
  passing: [''],
  defending: [''],
  goalKeeper: [''],
  physical: [''],
  mental: [''],
  transport: [''],
  photoUrl: [''],
})

ngOnInit() {
  this.playerService.getPlayers().subscribe((players) => {
    this.playerService.playerSig.set(players);
  })
 this.createProfileForm.controls.displayName.patchValue(this.displayName ?? null);
  
}

onSubmit() {
  const rawForm = this.createProfileForm.getRawValue();
  console.log(rawForm);

  }

}
