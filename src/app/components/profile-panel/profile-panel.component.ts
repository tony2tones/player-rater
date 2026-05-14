import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Router } from '@angular/router';
import {
  PlayerProfileInterface,
  Skills,
} from '../../interfaces/play-profile.interface';
import { CommonModule } from '@angular/common';
import { SkillRatingComponent } from '../skill-rating/skill-rating.component';

export type Player = {
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
  imports: [CardComponent, CommonModule, SkillRatingComponent],
  templateUrl: './profile-panel.component.html',
  styleUrl: './profile-panel.component.css',
  standalone: true,
})
export class ProfilePanelComponent implements OnInit {
  player = input<PlayerProfileInterface | null>(null);
  router = inject(Router);
  playerSkills = signal<Skills>({
    speed: null,
    shooting: null,
    passing: null,
    defending: null,
    dribbling: null,
    goalkeeper: null,
    physical: null,
    mental: null,
    vision: null,
    playmaking: null,
  });
  ngOnInit(): void {
    this.playerSkills.set(
      this.player()?.skills || {
        speed: null,
        shooting: null,
        passing: null,
        defending: null,
        dribbling: null,
        goalkeeper: null,
        physical: null,
        mental: null,
        vision: null,
        playmaking: null,
      },
    );
  }

  openPlayerProfile(id: string | null) {
    this.router.navigate(['/player-profile', id || '']);
  }
}
