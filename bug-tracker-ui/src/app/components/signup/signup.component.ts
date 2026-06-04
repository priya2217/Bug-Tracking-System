import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
  };
  agreedToTerms = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    // Validation
    if (
      !this.signupData.username ||
      !this.signupData.email ||
      !this.signupData.password
    ) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.signupData.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (!this.agreedToTerms) {
      this.errorMessage = 'You must agree to the Terms of Service';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.signupData).subscribe({
      next: () => {
        this.successMessage =
          'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
