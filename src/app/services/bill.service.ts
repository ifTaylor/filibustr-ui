import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sponsor {
  firstname: string;
  lastname: string;
  name: string;
  party: string;
  state: string;
}

export interface BillService {
  number: number;
  display_number: string;
  title: string;
  summary?: string;
  introduced_date: string;
  congress: number;
  bill_type: string;
  current_chamber: string | null;
  current_status: string;
  sponsor: Sponsor;
}

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private apiUrl = 'https://filibustr-api.onrender.com/api/bills';

  constructor(private http: HttpClient) {}

  getBills(limit = 10, offset = 0): Observable<BillService[]> {
    const params = { limit, offset };
    return this.http.get<BillService[]>(this.apiUrl, { params });
  }
}

