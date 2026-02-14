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
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
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
