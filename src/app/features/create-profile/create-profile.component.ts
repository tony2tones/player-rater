import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlayerServiceService } from '../../services/player-service.service';
import { CardComponent } from '../../components/card/card.component';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule,FormsModule, CardComponent, NgSelectModule],
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
createProfileForm:FormGroup = new FormGroup({});
isLoading = true;
// dropdown values
experienceOptions = [
  { id: 1, name: 'Beginner' },
  { id: 2, name: 'Intermediate' },
  { id: 3, name: 'Advanced' }
];

position = [
  { roleId: 1, roleName: 'Goalkeeper' },
  { roleId: 1, roleName: 'Defender' },
  { roleId: 2, roleName: 'Midfielder' },
  { roleId: 3, roleName: 'Forward' }
];
ratingOptions = [
  { value: 1, label: '1 - Poor' },
  { value: 2, label: '2 - Below Average' },
  { value: 3, label: '3 - Average' },
  { value: 4, label: '4 - Above Average' },
  { value: 5, label: '5 - Good' },
  { value: 6, label: '6 - Very Good' },
  { value: 7, label: '7 - Excellent' },
  { value: 8, label: '8 - Outstanding' },
  { value: 9, label: '9 - Elite' },
]

constructor() {
  this.profileId = this.params.snapshot.paramMap.get('profileId');
  const displayNameResult = this.firebaseAuth.currentUser?.displayName;
  if(displayNameResult) {
    this.displayName = displayNameResult;
  }
}

skillsList = ['speed', 'shooting', 'passing', 'defending', 'physical', 'mental'];

ngOnInit() {
  this.playerService.getPlayers().subscribe((players) => {
    this.playerService.playerSig.set(players);
  })
  this.createProfileFormGroup();
  if (this.createProfileForm) {
    this.createProfileForm.controls['displayName'].patchValue(this.displayName ?? null);
  }
 this.isLoading = false;
  
}

createProfileFormGroup() {
  this.createProfileForm = this.fb.group({
    displayName: [this.displayName ?? ''],
    location: [''],
    bio: [''],
    position: [''],
    photoUrl: [''],
    transport: [''],
    skills: this.fb.group({
      speed: new FormControl(null),
      shooting: new FormControl(null),
      passing: new FormControl(null),
      defending: new FormControl(null),
      physical: new FormControl(null),
      mental: new FormControl(null),
    })
  })
}

onSubmit() {
  const rawForm = this.createProfileForm.getRawValue();
  console.log(rawForm);

  }

}
