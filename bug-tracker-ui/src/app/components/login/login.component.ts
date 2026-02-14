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
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: '',
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage =
          error.error?.message || 'Invalid username or password';
      },
    });
  }
}
