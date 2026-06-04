import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BugService } from '../../services/bug.service';
import { ProjectService } from '../../services/project.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  // User data
  username = '';
  email = '';

  // Statistics
  totalBugs = 0;
  totalProjects = 0;
  resolvedBugs = 0;

  // Preferences
  emailNotifications = true;
  showEmailPublicly = false;

  // UI states
  editMode = false;
  saving = false;

  // Store original values for cancel
  private originalUsername = '';
  private originalEmail = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private bugService: BugService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadStatistics();
    this.loadPreferences();
  }

  /**
   * Load user profile from localStorage
   */
  loadProfile() {
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
    this.originalUsername = this.username;
    this.originalEmail = this.email;
  }

  /**
   * Load user statistics
   */
  loadStatistics() {
    // Load bugs count
    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        this.totalBugs = bugs.length;
        this.resolvedBugs = bugs.filter(
          (bug) => bug.status === 'Resolved',
        ).length;
      },
      error: () => {
        this.totalBugs = 0;
        this.resolvedBugs = 0;
      },
    });

    // Load projects count
    try {
      const projects = this.projectService.getProjects() || [];
      this.totalProjects = projects.length;
    } catch (e) {
      this.totalProjects = 0;
    }
  }

  /**
   * Load user preferences from localStorage
   */
  loadPreferences() {
    const emailNotif = localStorage.getItem('emailNotifications');
    const showEmail = localStorage.getItem('showEmailPublicly');

    this.emailNotifications = emailNotif !== 'false'; // default true
    this.showEmailPublicly = showEmail === 'true'; // default false
  }

  /**
   * Get user's initial for avatar
   */
  getInitial(): string {
    if (this.username && this.username.length > 0) {
      return this.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  /**
   * Get account created date
   */
  getAccountCreatedDate(): string {
    const created = localStorage.getItem('accountCreated');
    if (created) {
      return new Date(created).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Recently';
  }

  /**
   * Enable edit mode
   */
  enableEdit() {
    this.editMode = true;
  }

  /**
   * Cancel editing
   */
  cancelEdit() {
    // Restore original values
    this.username = this.originalUsername;
    this.email = this.originalEmail;
    this.editMode = false;
  }

  /**
   * Save profile changes
   */
  saveProfile() {
    // Validation
    if (!this.username || this.username.trim().length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.saving = true;

    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('username', this.username.trim());
      localStorage.setItem('email', this.email.trim());

      // Update original values
      this.originalUsername = this.username;
      this.originalEmail = this.email;

      this.saving = false;
      this.editMode = false;

      alert('✅ Profile updated successfully!');

      // In production, you would call your API here:
      // this.authService.updateProfile({ username: this.username, email: this.email })
      //   .subscribe(...)
    }, 800);
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Save preferences
   */
  savePreferences() {
    localStorage.setItem(
      'emailNotifications',
      this.emailNotifications.toString(),
    );
    localStorage.setItem(
      'showEmailPublicly',
      this.showEmailPublicly.toString(),
    );

    // Show brief confirmation
    const message = document.createElement('div');
    message.className =
      'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    message.textContent = '✓ Preferences saved';
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  /**
   * Delete account
   */
  deleteAccount() {
    const confirmation = confirm(
      '⚠️ WARNING: This will permanently delete your account and all data.\n\n' +
        'This action CANNOT be undone.\n\n' +
        'Are you absolutely sure?',
    );

    if (!confirmation) {
      return;
    }

    // Second confirmation
    const username = this.username;
    const typedUsername = prompt(
      `To confirm deletion, please type your username: "${username}"`,
    );

    if (typedUsername !== username) {
      alert('Username does not match. Account deletion cancelled.');
      return;
    }

    // Clear all data
    localStorage.clear();

    alert('Your account has been deleted.');

    // Logout and redirect
    this.auth.logout();
    this.router.navigate(['/signup']);

    // In production, call API to delete account:
    // this.authService.deleteAccount().subscribe(...)
  }

  /**
   * Logout
   */
  logout() {
    const confirmation = confirm('Are you sure you want to sign out?');

    if (confirmation) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
