import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './add-profile.component.html',
  styleUrl: './add-profile.component.css'
})
export class AddProfileComponent {
  fb = inject(FormBuilder);

  addProfileForm = this.fb.group({
    username: ['', Validators.required],
    area: ['', Validators.required],
    // rating which will be another beast
    bio:['']
  })

}
