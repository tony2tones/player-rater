import { Component, Input, OnInit, inject, input, signal } from '@angular/core';
import { PlayerProfileInterface } from '../../interfaces/play-profile.interface';
import { CardComponent } from '../card/card.component';
import { playerProfileInterface } from '../../features/dashboard/dashboard.component';
import { Router } from '@angular/router';

type Player = {
  transport: string;
  photoUrl: string;
  position: string;
  skills: {
    mental: { value: number; label: string };
    defending: { label: string; value: number };
    shooting: { label: string; value: number };
    physical: { value: number; label: string };
    passing: { label: string; value: number };
    speed: { label: string; value: number };
  };
  location: string;
  displayName: string;
  bio: string;
  id: string;
};

@Component({
  selector: 'app-profile-panel',
  imports: [CardComponent],
  templateUrl: './profile-panel.component.html',
  styleUrl: './profile-panel.component.css',
  standalone: true,
})
export class ProfilePanelComponent implements OnInit {
  player = input<playerProfileInterface | null>(null);
  router = inject(Router);

  ngOnInit(): void {}

  openPlayerProfile(id: string | null) {
    this.router.navigate(['/player-profile', id || '']);
  }
}
