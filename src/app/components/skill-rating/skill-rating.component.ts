import { Component, computed, input } from '@angular/core';
import { Skills } from '../../interfaces/play-profile.interface';
import { StarsComponent } from '../ui/stars/stars.component';

@Component({
  selector: 'app-skill-rating',
  imports: [StarsComponent],
  templateUrl: './skill-rating.component.html',
  styleUrl: './skill-rating.component.css',
})
export class SkillRatingComponent {
  playerSkills = input<Skills>({
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

  playerScore = computed(() => {
    const values = Object.values(this.playerSkills()).filter(
      (v): v is number => v !== null,
    );
    if (values.length === 0) return 0;
    const avg = values.reduce((acc, v) => acc + v, 0) / values.length;
    return ((avg - 1) / 5) * 5; // scale 1–6 to 0–5 stars
  });
}
