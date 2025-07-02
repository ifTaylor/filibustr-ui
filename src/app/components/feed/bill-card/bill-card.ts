import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotePanel } from '../../vote-panel/vote-panel';

@Component({
  selector: 'app-bill-card',
  imports: [CommonModule, VotePanel],
  templateUrl: './bill-card.html',
})
export class BillCard {
  @Input() bill!: { id: string; title: string; summary: string };
}
