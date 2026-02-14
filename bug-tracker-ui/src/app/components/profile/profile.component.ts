import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  username = '';
  email = '';
  editMode = false;
  saving = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    if (!this.username.trim() || !this.email.trim()) {
      alert('Please provide both username and email');
      return;
    }

    this.saving = true;
    // Persist locally
    localStorage.setItem('username', this.username);
    localStorage.setItem('email', this.email);

    // Optionally in future: call backend to update profile if endpoint exists

    setTimeout(() => {
      this.saving = false;
      this.editMode = false;
      alert('Profile saved locally');
    }, 400);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
