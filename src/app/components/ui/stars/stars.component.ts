import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stars',
  standalone: true,
  templateUrl: './stars.component.html',
})
export class StarsComponent {
  value = input.required<number>();
  max = input<number>(5);

  fillPercent = computed(() =>
    Math.min((this.value() / this.max()) * 100, 100),
  );
}
