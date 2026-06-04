import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.models';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  private apiUrl = 'http://localhost:5245/api/bug';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getBugById(id: number): Observable<Bug> {
    return this.http.get<Bug>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createBug(bug: Bug): Observable<Bug> {
    return this.http.post<Bug>(this.apiUrl, bug, {
      headers: this.getHeaders(),
    });
  }

  updateBug(id: number, bug: Bug): Observable<Bug> {
    return this.http.put<Bug>(`${this.apiUrl}/${id}`, bug, {
      headers: this.getHeaders(),
    });
  }

  deleteBug(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getBugsByProject(projectId: number): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/project/${projectId}`, {
      headers: this.getHeaders(),
    });
  }

  getBugsByStatus(status: string): Observable<Bug[]> {
    return this.http.get<Bug[]>(`${this.apiUrl}/status/${status}`, {
      headers: this.getHeaders(),
    });
  }
}
