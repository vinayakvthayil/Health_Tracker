import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HealthRecord } from '../models/health.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly API_URL = `${environment.apiUrl}/api/health`;

  constructor(private http: HttpClient) {}

  saveRecord(record: HealthRecord): Observable<HealthRecord> {
    return this.http.post<HealthRecord>(`${this.API_URL}/records`, record);
  }

  getRecords(): Observable<HealthRecord[]> {
    return this.http.get<HealthRecord[]>(`${this.API_URL}/records`);
  }
} 