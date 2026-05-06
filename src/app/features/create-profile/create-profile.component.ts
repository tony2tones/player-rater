import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player-service.service';
import { CardComponent } from '../../components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';

type ProfileForm = FormGroup<{
  fullName: FormControl<string | null>;
  displayName: FormControl<string | null>;
  location: FormControl<string | null>;
  bio: FormControl<string | null>;
  position: FormControl<string | null>;
  photoUrl: FormControl<string | null>;
  transport: FormControl<string | null>;
  skills: FormGroup<{
    speed: FormControl<number | null>;
    shooting: FormControl<number | null>;
    passing: FormControl<number | null>;
    defending: FormControl<number | null>;
    physical: FormControl<number | null>;
    mental: FormControl<number | null>;
  }>;
}>;

@Component({
  selector: 'app-create-profile',
  imports: [ReactiveFormsModule, FormsModule, CardComponent, NgSelectModule],
  standalone: true,
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css',
})
export class CreateProfileComponent {
  router = inject(Router);
  playerService = inject(PlayerService);
  fb = inject(FormBuilder);
  params = inject(ActivatedRoute);
  profileId: string | null = null;
  createProfileForm!: ProfileForm;
  isLoading = true;
  // dropdown values
  experienceOptions = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' },
  ];

  position = [
    { roleId: 1, roleName: 'Goalkeeper' },
    { roleId: 1, roleName: 'Defender' },
    { roleId: 2, roleName: 'Midfielder' },
    { roleId: 3, roleName: 'Forward' },
  ];
  ratingOptions = [
    { value: 1, label: '1 - Poor' },
    { value: 2, label: '2 - Below Average' },
    { value: 3, label: '3 - Average' },
    { value: 4, label: '4 - Above Average' },
    { value: 5, label: '5 - Good' },
    { value: 6, label: '6 - Very Good' },
    { value: 7, label: '7 - Excellent' },
  ];

  constructor() {
    this.profileId = this.params.snapshot.paramMap.get('profileId');
    this.createProfileForm = this.buildForm();
    effect(() => {
      const player = this.playerService.currentPlayerSig();
      if (player) {
        this.createProfileForm.patchValue({
          fullName: player.fullName ?? null,
          displayName: player.displayName ?? null,
          location: player.location ?? null,
          bio: player.bio ?? null,
          position: player.position ?? null,
          photoUrl: player.photoUrl ?? null,
          transport: player.transport ?? null,
          skills: {
            speed: player.skills?.speed ?? null,
            shooting: player.skills?.shooting ?? null,
            passing: player.skills?.passing ?? null,
            defending: player.skills?.defending ?? null,
            physical: player.skills?.physical ?? null,
            mental: player.skills?.mental ?? null,
          },
        });
      }
    });
  }

  skillsList = [
    'speed',
    'shooting',
    'passing',
    'defending',
    'physical',
    'mental',
  ];

  ngOnInit() {
    this.isLoading = false;
  }

  buildForm(): ProfileForm {
    return this.fb.group({
      fullName: new FormControl<string | null>(null),
      displayName: new FormControl<string | null>(null),
      location: new FormControl<string | null>(null),
      bio: new FormControl<string | null>(null),
      position: new FormControl<string | null>(null),
      photoUrl: new FormControl<string | null>(null),
      transport: new FormControl<string | null>(null),
      skills: this.fb.group({
        speed: new FormControl<number | null>(null),
        shooting: new FormControl<number | null>(null),
        passing: new FormControl<number | null>(null),
        defending: new FormControl<number | null>(null),
        physical: new FormControl<number | null>(null),
        mental: new FormControl<number | null>(null),
      }),
    }) as ProfileForm;
  }

  onSubmit() {
    if (!this.profileId) return;
    const playerProfile =
      this.createProfileForm.getRawValue() as PlayerProfileInterface;
    this.playerService.savePlayer(this.profileId, playerProfile).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => console.log(`${err}`),
    });
  }
}
