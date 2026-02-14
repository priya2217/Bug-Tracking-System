import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5245/api';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  // REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // GET BUGS
  getBugs() {
    return this.http.get(`${this.baseUrl}/bugs`);
  }
}
