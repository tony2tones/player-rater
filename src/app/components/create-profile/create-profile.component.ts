import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
fb = inject(FormBuilder);
@Input() profileId: string | null = null;
@Input() displayName: string | null = null;

createProfileForm = this.fb.group({
  displayName: [this.displayName],
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
})

onSubmit() {
  const rawForm = this.createProfileForm.getRawValue();
  console.log(rawForm);
  }
}
