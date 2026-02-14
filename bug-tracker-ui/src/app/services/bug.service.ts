import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bug, BugSummary } from '../models/bug.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BugService {
  private apiUrl = 'http://localhost:5245/api/bug';

  constructor(private http: HttpClient) {}

  // Fetch all bugs from backend
  getAllBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl);
  }

  // Get bug summary statistics
  getBugSummary(): Observable<BugSummary> {
    return this.http.get<BugSummary>(`${this.apiUrl}/summary`);
  }

  // Create a new bug
  createBug(bug: Bug): Observable<Bug> {
    return this.http.post<Bug>(this.apiUrl, bug);
  }

  // Delete a bug by ID
  deleteBug(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
