import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillCard } from './bill-card/bill-card';
import { BillService, Bill } from '../../services/bill';

@Component({
  standalone: true,
  selector: 'app-feed',
  imports: [CommonModule, BillCard],
  templateUrl: './feed.html',
})
export class Feed {
  bills: { id: string; title: string; summary: string }[] = [];
  limit = 5;
  offset = 0;
  isLoading = false;

  constructor(private billService: BillService) {
    this.loadBills();
  }

  loadBills() {
    this.isLoading = true;
    this.billService.getBills(this.limit, this.offset).subscribe({
      next: (data: Bill[]) => {
        const normalized = data.map(b => ({
          id: b.number.toString(),
          title: b.title,
          summary: b.summary ?? '',
        }));
        this.bills = [...this.bills, ...normalized];
        this.offset += this.limit;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load bills', err);
        this.isLoading = false;
      },
    });
  }
}
