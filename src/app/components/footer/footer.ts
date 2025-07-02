import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {}
