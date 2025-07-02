import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {}
