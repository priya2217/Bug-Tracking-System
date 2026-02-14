import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-sidebar
        *ngIf="authService.isAuthenticated()"
        (toggle)="toggleCollapsed()"
        [collapsed]="isCollapsed"
      ></app-sidebar>

      <main class="flex-1 p-6 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background: #f5f7fa;
      }
      .navbar {
        background: white;
        padding: 15px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .nav-brand {
        font-size: 1.5em;
        font-weight: bold;
        color: #667eea;
      }
      .nav-links {
        display: flex;
        gap: 20px;
        align-items: center;
      }
      .nav-links a {
        text-decoration: none;
        color: #666;
        font-weight: 500;
        transition: color 0.3s;
      }
      .nav-links a:hover,
      .nav-links a.active {
        color: #667eea;
      }
      .logout-btn {
        padding: 8px 20px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
      }
      .logout-btn:hover {
        background: #c82333;
      }
    `,
  ],
})
export class AppComponent {
  isCollapsed = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
