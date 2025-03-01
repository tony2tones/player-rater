import { Component, inject, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
  firebaseAuth = inject(Auth);
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
 this.createProfileForm.controls.displayName.patchValue(this.displayName ?? null);
  
}
sFunctions() {
  this.createProfileForm.controls.displayName.patchValue(this.displayName ?? null);
  console.log(this.profileId);
  console.log(this.displayName);
}

onSubmit() {
  const rawForm = this.createProfileForm.getRawValue();
  console.log(rawForm);
  }

  set applyDisplayName(value: string) {
    this.displayName = value;
  }
}
