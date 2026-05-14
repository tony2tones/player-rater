import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';
import { environment } from '../../../../environments';

type ProfileForm = FormGroup<{
  fullName: FormControl<string | null>;
  displayName: FormControl<string | null>;
  location: FormControl<string | null>;
  bio: FormControl<string | null>;
  position: FormControl<string | null>;
  photoUrl: FormControl<string | null>;
  transport: FormControl<string | null>;
  isOrganiser: FormControl<boolean | null>;
  ageRange: FormControl<string | null>;
  availableForLeague: FormControl<boolean | null>;
  skills: FormGroup<{
    speed: FormControl<number | null>;
    shooting: FormControl<number | null>;
    passing: FormControl<number | null>;
    defending: FormControl<number | null>;
    physical: FormControl<number | null>;
    mental: FormControl<number | null>;
    dribbling: FormControl<number | null>;
    goalkeeper: FormControl<number | null>;
    vision: FormControl<number | null>;
    playmaking: FormControl<number | null>;
  }>;
}>;

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, FormsModule, NgSelectModule],
  standalone: true,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent {
  router = inject(Router);
  playerService = inject(PlayerService);
  fb = inject(FormBuilder);
  params = inject(ActivatedRoute);

  profileId: string | null = null;
  profileForm!: ProfileForm;
  isLoading = true;
  isOrganiser = signal(false);

  previewUrl = signal<string | null>(null);
  uploadProgress = signal<number | null>(null);
  isUploading = signal(false);

  readonly positions = [
    { value: 'GK', label: 'Goalkeeper' },
    { value: 'DEF', label: 'Defender' },
    { value: 'MID', label: 'Midfielder' },
    { value: 'FWD', label: 'Forward' },
  ] as const;

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

  ageRangeOptions = [
    { value: '20s', label: '20s' },
    { value: '30s', label: '30s' },
    { value: '40s', label: '40s' },
    { value: '50s+', label: '50s+' },
  ];

  ratingOptions = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Novice' },
    { value: 3, label: 'Intermediate' },
    { value: 4, label: 'Semi-Pro' },
    { value: 5, label: 'Veteran' },
    { value: 6, label: 'Pro' },
  ];

  skillsList = [
    'speed',
    'shooting',
    'passing',
    'defending',
    'physical',
    'mental',
    'dribbling',
    'goalkeeper',
    'vision',
    'playmaking',
  ];

  constructor() {
    this.profileId = this.params.snapshot.paramMap.get('profileId');
    this.profileForm = this.buildForm();
    effect(() => {
      const player = this.playerService.currentPlayerSig();
      if (player) {
        this.profileForm.patchValue({
          fullName: player.fullName ?? null,
          displayName: player.displayName ?? null,
          location: player.location ?? null,
          bio: player.bio ?? null,
          position: player.position ?? null,
          photoUrl: player.photoUrl ?? null,
          transport: player.transport ?? null,
          isOrganiser: player.isOrganiser ?? null,
          ageRange: player.ageRange ?? null,
          availableForLeague: player.availableForLeague ?? null,
          skills: {
            speed: player.skills?.speed ?? null,
            shooting: player.skills?.shooting ?? null,
            passing: player.skills?.passing ?? null,
            defending: player.skills?.defending ?? null,
            physical: player.skills?.physical ?? null,
            mental: player.skills?.mental ?? null,
            dribbling: player.skills?.dribbling ?? null,
            goalkeeper: player.skills?.goalkeeper ?? null,
            vision: player.skills?.vision ?? null,
            playmaking: player.skills?.playmaking ?? null,
          },
        });
        if (player.photoUrl) {
          this.previewUrl.set(player.photoUrl);
        }
        this.isOrganiser.set(player.isOrganiser ?? false);
      }
    });
  }

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
      isOrganiser: new FormControl<boolean | null>(null),
      ageRange: new FormControl<string | null>(null),
      availableForLeague: new FormControl<boolean | null>(null),
      skills: this.fb.group({
        speed: new FormControl<number | null>(null),
        shooting: new FormControl<number | null>(null),
        passing: new FormControl<number | null>(null),
        defending: new FormControl<number | null>(null),
        physical: new FormControl<number | null>(null),
        mental: new FormControl<number | null>(null),
        dribbling: new FormControl<number | null>(null),
        goalkeeper: new FormControl<number | null>(null),
        vision: new FormControl<number | null>(null),
        playmaking: new FormControl<number | null>(null),
      }),
    }) as ProfileForm;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.previewUrl.set(URL.createObjectURL(file));
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    const xhr = new XMLHttpRequest();
    const { cloudName } = environment.cloudinary;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        this.uploadProgress.set(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        this.profileForm.patchValue({ photoUrl: response.secure_url });
        this.previewUrl.set(response.secure_url);
      } else {
        console.error('Upload failed', xhr.responseText);
      }
      this.isUploading.set(false);
      this.uploadProgress.set(null);
    });

    xhr.addEventListener('error', () => {
      console.error('Upload error');
      this.isUploading.set(false);
      this.uploadProgress.set(null);
    });

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    );
    xhr.send(formData);
  }

  onSubmit() {
    if (!this.profileId || this.isUploading()) return;
    const playerProfile =
      this.profileForm.getRawValue() as PlayerProfileInterface;
    playerProfile.isOrganiser = this.isOrganiser();
    this.playerService.savePlayer(this.profileId, playerProfile).subscribe({
      next: () => {
        const current = this.playerService.currentPlayerSig();
        if (current) {
          this.playerService.currentPlayerSig.set({ ...current, ...playerProfile });
        }
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => console.log(`${err}`),
    });
  }
}
