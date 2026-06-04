import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: '',
  };
  rememberMe = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // Check if user was remembered
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
      const savedUser = localStorage.getItem('rememberedUser');
      if (savedUser) {
        this.loginData.usernameOrEmail = savedUser;
        this.rememberMe = true;
      }
    }
  }

  onSubmit(): void {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Handle remember me
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem(
            'rememberedUser',
            this.loginData.usernameOrEmail,
          );
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedUser');
        }

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Invalid username or password. Please try again.';
      },
    });
  }
}
