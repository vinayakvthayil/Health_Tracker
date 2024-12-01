import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest, LoginResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
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
          <h1 class="text-2xl font-semibold text-slate-800">HealthTracker</h1>
          <p class="text-slate-600 mt-2">Welcome back! Please enter your details.</p>
        </div>

        <!-- Auth Type Selector -->
        <div class="bg-slate-100 p-1 rounded-lg mb-8 relative">
          <div class="grid grid-cols-2 gap-1 relative">
            <button
                (click)="switchToUser()"
                [class]="authType === 'user' ? 'relative z-10 text-slate-800' : 'text-slate-600'"
                class="py-2.5 px-4 text-sm font-medium text-center rounded-md transition-colors relative"
            >
              User
            </button>
            <button
                (click)="switchToAdmin()"
                [class]="authType === 'admin' ? 'relative z-10 text-slate-800' : 'text-slate-600'"
                class="py-2.5 px-4 text-sm font-medium text-center rounded-md transition-colors relative"
            >
              Admin
            </button>
            <!-- Sliding Background -->
            <div
                class="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-200 ease-in-out"
                [style.transform]="authType === 'admin' ? 'translateX(calc(100% + 8px))' : 'translateX(0)'"
            ></div>
          </div>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8">
          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center">
              <i class="fas fa-exclamation-circle mr-2"></i>
              {{ errorMessage }}
            </div>
          }

          <form #loginForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-5">
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
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <i class="fas fa-lock text-sm"></i>
                </div>
                <input
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    #passwordInput="ngModel"
                    required
                    minlength="5"
                    class="block w-full pl-11 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    [class.border-red-300]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)"
                    placeholder="Enter your password"
                />
              </div>
              @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
                <p class="mt-1.5 text-sm text-red-500">
                  @if (passwordInput.errors?.['required']) {
                    Please enter your password
                  } @else if (passwordInput.errors?.['minlength']) {
                    Password must be at least 5 characters
                  }
                </p>
              }
            </div>

            <!-- Admin Code Field -->
            @if (authType === 'admin') {
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                  Admin Code
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <i class="fas fa-key text-sm"></i>
                  </div>
                  <input
                      type="password"
                      [(ngModel)]="adminCode"
                      name="adminCode"
                      #adminCodeInput="ngModel"
                      required
                      class="block w-full pl-11 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      [class.border-red-300]="adminCodeInput.invalid && (adminCodeInput.dirty || adminCodeInput.touched)"
                      placeholder="Enter admin access code"
                  />
                </div>
                @if (adminCodeInput.invalid && (adminCodeInput.dirty || adminCodeInput.touched)) {
                  <p class="mt-1.5 text-sm text-red-500">
                    Please enter the admin access code
                  </p>
                }
              </div>
            }

            <!-- Remember Me Checkbox -->
            <div class="flex items-center">
              <input
                  type="checkbox"
                  id="remember"
                  class="w-4 h-4 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label for="remember" class="ml-2 text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                [disabled]="loginForm.invalid"
                class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold rounded-lg 
                     hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                     shadow-lg shadow-indigo-200 transform transition-all active:scale-[0.98] 
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-indigo-600 
                     disabled:active:scale-100"
            >
              Sign in
            </button>
          </form>
        </div>

        <!-- Register Link -->
        <p class="mt-6 text-center text-slate-600">
          Don't have an account?
          <a routerLink="/register" class="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
            Create account
          </a>
        </p>

        <!-- Additional Links -->
        <div class="mt-8 text-center text-sm text-slate-500">
          <a href="#" class="hover:text-slate-700">Terms of Service</a>
          <span class="mx-2">·</span>
          <a href="#" class="hover:text-slate-700">Privacy Policy</a>
        </div>
      </div>
    </div>
  `
})

export class LoginComponent {
  authType: 'user' | 'admin' = 'user';
  email = '';
  password = '';
  adminCode = '';
  errorMessage: string | null = null;

  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  switchToUser() {
    this.authType = 'user';
    this.resetForm();
  }

  switchToAdmin() {
    this.authType = 'admin';
    this.resetForm();
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.adminCode = '';
    this.errorMessage = null;
  }

  onSubmit() {
    this.errorMessage = null;
    const request: LoginRequest = {
      email: this.email,
      password: this.password,
      adminCode: this.authType === 'admin' ? this.adminCode : undefined
    };

    const login$ = this.authType === 'admin'
        ? this.authService.adminLogin(request)
        : this.authService.login(request);

    login$.subscribe({
      next: (response: LoginResponse) => {
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.errorMessage = this.authType === 'admin'
              ? 'Invalid admin credentials or access code'
              : 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}