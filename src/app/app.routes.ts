import { Routes } from '@angular/router';
import { Feed } from './components/feed/feed';
import { CreateBill } from './components/create-bill/create-bill';

export const routes: Routes = [
  { path: '', component: Feed },
  { path: 'create', component: CreateBill },
];
