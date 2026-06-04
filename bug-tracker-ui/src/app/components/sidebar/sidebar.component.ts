import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BugService } from '../../services/bug.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  bugCount = 0;
  currentRoute = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private bugService: BugService,
  ) {
    // Track current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnInit() {
    this.loadBugCount();
    this.currentRoute = this.router.url;
  }

  loadBugCount() {
    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        this.bugCount = bugs.filter((bug) => bug.status !== 'Resolved').length;
      },
      error: () => {
        this.bugCount = 0;
      },
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }

  getUserInitial(): string {
    const username = this.getUsername();
    return username.charAt(0).toUpperCase();
  }

  onToggle() {
    this.toggle.emit();
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
