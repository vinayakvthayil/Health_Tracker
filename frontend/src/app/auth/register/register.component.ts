import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div class="w-full max-w-[440px] mx-auto relative">
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-4 shadow-xl shadow-indigo-200">
            <i class="fas fa-heartbeat text-xl"></i>
          </div>
          <h1 class="text-2xl font-semibold text-slate-800">Create Account</h1>
          <p class="text-slate-600 mt-2">Start tracking your health journey today</p>
        </div>

        <!-- Register Form -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8">
          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
              <i class="fas fa-exclamation-circle mr-2"></i>
              {{ errorMessage }}
            </div>
          }

          <form #registerForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                  First Name
                </label>
                <input
                    type="text"
                    [(ngModel)]="firstName"
                    name="firstName"
                    #firstNameInput="ngModel"
                    required
                    class="block w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="firstNameInput.invalid && (firstNameInput.dirty || firstNameInput.touched)"
                    placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                    type="text"
                    [(ngModel)]="lastName"
                    name="lastName"
                    #lastNameInput="ngModel"
                    required
                    class="block w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="lastNameInput.invalid && (lastNameInput.dirty || lastNameInput.touched)"
                    placeholder="Doe"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i class="fas fa-envelope text-sm"></i>
                </div>
                <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    #emailInput="ngModel"
                    required
                    email
                    class="block w-full pl-11 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
                    placeholder="name@example.com"
                />
              </div>
              @if (emailInput.invalid && (emailInput.dirty || emailInput.touched)) {
                <p class="mt-1.5 text-sm text-red-500">
                  @if (emailInput.errors?.['required']) {
                    Please enter your email
                  } @else if (emailInput.errors?.['email']) {
                    Please enter a valid email address
                  }
                </p>
              }
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i class="fas fa-lock text-sm"></i>
                </div>
                <input
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    #passwordInput="ngModel"
                    required
                    minlength="6"
                    class="block w-full pl-11 pr-12 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)"
                    placeholder="Create a password"
                />
                <button
                    type="button"
                    (click)="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
                <p class="mt-1.5 text-sm text-red-500">
                  Password must be at least 6 characters
                </p>
              }
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i class="fas fa-lock text-sm"></i>
                </div>
                <input
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    #confirmInput="ngModel"
                    required
                    [pattern]="password"
                    class="block w-full pl-11 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="confirmInput.invalid && (confirmInput.dirty || confirmInput.touched)"
                    placeholder="Confirm your password"
                />
              </div>
              @if (confirmInput.invalid && (confirmInput.dirty || confirmInput.touched)) {
                <p class="mt-1.5 text-sm text-red-500">
                  Passwords do not match
                </p>
              }
            </div>

            <!-- Terms Acceptance -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                    type="checkbox"
                    id="terms"
                    [(ngModel)]="acceptedTerms"
                    name="terms"
                    required
                    class="w-4 h-4 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500"
                />
              </div>
              <label for="terms" class="ml-2 text-sm text-slate-600">
                I agree to the
                <a href="#" class="text-indigo-600 hover:text-indigo-700 hover:underline">Terms of Service</a>
                and
                <a href="#" class="text-indigo-600 hover:text-indigo-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                [disabled]="registerForm.invalid || !acceptedTerms"
                class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold rounded-lg 
                     hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                     shadow-lg shadow-indigo-200 transform transition-all active:scale-[0.98] 
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-indigo-600 
                     disabled:active:scale-100"
            >
              Create Account
            </button>
          </form>
        </div>

        <!-- Login Link -->
        <p class="mt-6 text-center text-slate-600">
          Already have an account?
          <a routerLink="/login" class="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  onSubmit() {
    this.errorMessage = null;

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const request: RegisterRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}