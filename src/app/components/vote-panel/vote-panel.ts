import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-vote-panel',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './vote-panel.html',
})
export class VotePanel {
  private _billId: string = '';

  @Input()
  set billId(value: string | number | undefined) {
    this._billId = value?.toString() ?? '';
  }
  get billId(): string {
    return this._billId;
  }

  selected: 'support' | 'oppose' | 'unsure' | null = null;

  vote(type: 'support' | 'oppose' | 'unsure') {
    this.selected = type;
    console.log(`Voted ${type} on bill ${this.billId}`);
  }
}
