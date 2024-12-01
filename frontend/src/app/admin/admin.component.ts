import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../core/services/admin.service';
import { User } from '../core/models/auth.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-30">
        <div class="flex items-center gap-3 p-6 border-b border-gray-200">
          <div class="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-heartbeat text-white"></i>
          </div>
          <span class="font-semibold text-gray-900">HealthTracker Admin</span>
        </div>

        <nav class="p-4">
          <a href="#" class="flex items-center gap-3 px-4 py-3 text-violet-600 bg-violet-50 rounded-lg font-medium">
            <i class="fas fa-users"></i>
            <span>User Management</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="pl-64">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors">
              <i class="fas fa-download"></i>
              Export Users
            </button>
            <div class="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-violet-600"></i>
            </div>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="p-8">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Users -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-users text-violet-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Total Users</h3>
                  <p class="text-2xl font-bold text-gray-900">{{users.length}}</p>
                </div>
              </div>
            </div>

            <!-- Active Users -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-user-check text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Active Users</h3>
                  <p class="text-2xl font-bold text-gray-900">{{getActiveUsers()}}</p>
                </div>
              </div>
            </div>

            <!-- New Users Today -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-user-plus text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">New Today</h3>
                  <p class="text-2xl font-bold text-gray-900">{{getNewUsers()}}</p>
                </div>
              </div>
            </div>

            <!-- Banned Users -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-user-slash text-red-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Banned Users</h3>
                  <p class="text-2xl font-bold text-gray-900">{{getBannedUsers()}}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Table -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h2 class="font-semibold text-gray-900">Users List</h2>
              <div class="flex items-center gap-4">
                <div class="relative">
                  <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                      type="text"
                      placeholder="Search users..."
                      class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                </div>
                <button class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>
                  Add User
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">User ID</th>
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Email</th>
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Last Active</th>
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                  @for (user of users; track user.id) {
                    <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td class="py-4 px-6">
                        <span class="text-sm font-medium text-gray-900">#{{user.id}}</span>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-violet-600">
                              {{user.email.charAt(0).toUpperCase()}}
                            </span>
                          </div>
                          <span class="text-sm text-gray-900">{{user.email}}</span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <span class="text-sm text-gray-500">{{user.lastActive | date:'medium'}}</span>
                      </td>
                      <td class="py-4 px-6">
                        <span [class]="getStatusClass(user.status)">
                          {{user.status}}
                        </span>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <button
                              class="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                              title="Edit User"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                              class="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                              title="User Details"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                          <button
                              (click)="deleteUser(user)"
                              class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <span class="text-sm text-gray-500">Showing 1 to {{users.length}} of {{users.length}} entries</span>
              <div class="flex items-center gap-2">
                <button class="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button class="px-3 py-1 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
                  1
                </button>
                <button class="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AdminComponent implements OnInit {
  users: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error: Error) => {
        console.error('Failed to load users:', error);
      }
    });
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'active').length;
  }

  getBannedUsers(): number {
    return this.users.filter(user => user.status === 'banned').length;
  }

  getNewUsers(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.users.filter(user => new Date(user.lastActive) >= today).length;
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'banned':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (error: Error) => {
          console.error('Failed to delete user:', error);
        }
      });
    }
  }
}