import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotePanel } from '../vote-panel/vote-panel';

@Component({
  selector: 'app-bill-card',
  imports: [CommonModule, VotePanel],
  templateUrl: './bill-card.html',
})
export class BillCard {
  @Input() bill!: {
    id: string;
    title: string;
    summary: string;
    introduced_date: string;
    current_status: string;
  };

  snakeToTitleCase(snake: string): string {
    return snake
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
