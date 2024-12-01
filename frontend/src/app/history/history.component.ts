import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../core/services/health.service';
import { HealthRecord } from '../core/models/health.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50">
      <!-- Sidebar (matching dashboard) -->
      <aside class="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-30">
        <div class="flex items-center gap-3 p-6 border-b border-slate-200">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-heartbeat text-white text-xl"></i>
          </div>
          <span class="font-semibold text-slate-800">HealthTracker</span>
        </div>

        <nav class="p-4">
          <a href="/dashboard" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a href="/history" class="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg font-medium mt-2">
            <i class="fas fa-history"></i>
            <span>History</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="pl-64">
        <!-- Top Bar -->
        <header class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0">
          <h1 class="text-2xl font-bold text-slate-800">Health History</h1>
          <div class="flex items-center gap-4">
            <div class="flex items-center bg-slate-100 rounded-lg p-2">
              <i class="fas fa-calendar-alt text-slate-500 mr-2"></i>
              <select class="bg-transparent text-sm text-slate-600 focus:outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Custom range</option>
              </select>
            </div>
            <div class="relative">
              <button
                  (click)="toggleProfileDropdown()"
                  class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center relative"
              >
                <i class="fas fa-user text-slate-600"></i>
                <span
                    *ngIf="isProfileDropdownOpen"
                    class="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                >
<!--                  <div class="px-4 py-3 border-b border-slate-200">-->
                  <!--                    <p class="text-sm font-medium text-slate-800">{{ user.firstName + " " + user.lastName }}</p>-->
                  <!--                    <p class="text-xs text-slate-500">{{ user.email }}</p>-->
                  <!--                  </div>-->
                  <button
                      (click)="viewHistory()"
                      class="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 transition-colors"
                  >
                    <i class="fas fa-home mr-2"></i>
                    Dashboard
                  </button>
                  <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-red-600 transition-colors"
                  >
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </span>
              </button>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="p-8">
          <!-- Summary Cards -->
          <div class="grid grid-cols-4 gap-6 mb-8">
            @for (metric of metrics; track metric.name) {
              <div class="bg-white rounded-xl border border-slate-200 p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                       [class]="getMetricBgClass(metric.name)">
                    <i [class]="getMetricIcon(metric.name) + ' text-xl'"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">{{metric.name}}</h3>
                    <p class="text-sm text-slate-500">Average: {{calculateAverage(metric.key)}} {{metric.unit}}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span [class]="getTrendClass(calculateTrend(metric.key))">
                    <i [class]="getTrendIcon(calculateTrend(metric.key))"></i>
                    {{calculateTrend(metric.key)}}%
                  </span>
                  <span class="text-sm text-slate-500">vs last week</span>
                </div>
              </div>
            }
          </div>

          <!-- Detailed Records -->
          <div class="bg-white rounded-xl border border-slate-200">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-semibold text-slate-800">Detailed Records</h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                <tr class="bg-slate-50">
                  <th class="text-left py-4 px-6 text-sm font-medium text-slate-500">Date</th>
                  @for (metric of metrics; track metric.name) {
                    <th class="text-left py-4 px-6 text-sm font-medium text-slate-500">
                      {{metric.name}}
                    </th>
                  }
                </tr>
                </thead>
                <tbody>
                  @for (record of healthRecords; track record.date) {
                    <tr class="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                      <td class="py-4 px-6">
                        <div class="flex flex-col">
                          <span class="font-medium text-slate-800">
                            {{record.date | date:'MMM d, yyyy'}}
                          </span>
                          <span class="text-sm text-slate-500">
                            {{record.date | date:'shortTime'}}
                          </span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-walking text-indigo-600"></i>
                          <span>{{record.steps}}</span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-fire text-orange-600"></i>
                          <span>{{record.calories}} kcal</span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-heartbeat text-red-600"></i>
                          <span>{{record.heartRate}} BPM</span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-moon text-indigo-600"></i>
                          <span>{{record.sleep}} hrs</span>
                        </div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-tint text-blue-600"></i>
                          <span>{{record.water}} ml</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <span class="text-sm text-slate-500">
                Showing 1 to {{healthRecords.length}} of {{healthRecords.length}} records
              </span>
              <div class="flex gap-2">
                <button class="px-3 py-1 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  Previous
                </button>
                <button class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  1
                </button>
                <button class="px-3 py-1 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
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
export class HistoryComponent implements OnInit {
  healthRecords: HealthRecord[] = [];
  selectedMetric: string = 'steps';
  isProfileDropdownOpen = false;
  metrics = [
    { name: 'Steps', key: 'steps', max: 10000, unit: 'steps' },
    { name: 'Calories', key: 'calories', max: 2500, unit: 'kcal' },
    { name: 'Heart Rate', key: 'heartRate', max: 180, unit: 'BPM' },
    { name: 'Sleep', key: 'sleep', max: 9, unit: 'hours' },
    { name: 'Water', key: 'water', max: 2500, unit: 'ml' }
  ];

  constructor(
      private router: Router,
      private healthService: HealthService
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  getValues(key: string): number[] {
    return this.healthRecords.map(record => record[key as keyof HealthRecord] as number);
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  getMetricIcon(metricName: string): string {
    const icons: { [key: string]: string } = {
      'Steps': 'fas fa-walking icon-purple',
      'Calories': 'fas fa-fire icon-orange',
      'Heart Rate': 'fas fa-heartbeat icon-red',
      'Sleep': 'fas fa-bed icon-indigo',
      'Water': 'fas fa-tint icon-blue'
    };
    return icons[metricName] || 'fas fa-chart-line';
  }

  getMetricColor(metricName: string): string {
    const colors: { [key: string]: string } = {
      'Steps': '#7c3aed',
      'Calories': '#f97316',
      'Heart Rate': '#ef4444',
      'Sleep': '#4f46e5',
      'Water': '#3b82f6'
    };
    return colors[metricName] || '#7c3aed';
  }

  private loadRecords() {
    this.healthService.getRecords().subscribe({
      next: (records: HealthRecord[]) => {
        this.healthRecords = records;
      },
      error: (error: Error) => {
        console.error('Failed to load records:', error);
      }
    });
  }

  getMetricBgClass(metricName: string): string {
    const classes: { [key: string]: string } = {
      'Steps': 'bg-indigo-100',
      'Calories': 'bg-orange-100',
      'Heart Rate': 'bg-red-100',
      'Sleep': 'bg-purple-100',
      'Water': 'bg-blue-100'
    };
    return classes[metricName] || 'bg-slate-100';
  }

  calculateAverage(key: string): number {
    const values = this.getValues(key);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }

  calculateTrend(key: string): number {
    const values = this.getValues(key);
    if (values.length < 2) return 0;

    const recent = values.slice(-7);
    const previous = values.slice(-14, -7);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  }

  getTrendClass(trend: number): string {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getTrendIcon(trend: number): string {
    return `fas fa-arrow-${trend >= 0 ? 'up' : 'down'}`;
  }

  getYAxisTicks(metricKey: string): number[] {
    const metric = this.metrics.find(m => m.key === metricKey);
    if (!metric) return [];

    const max = metric.max;
    return [max, max * 0.75, max * 0.5, max * 0.25, 0];
  }

  getMetricMax(key: string): number {
    const metric = this.metrics.find(m => m.key === key);
    return metric ? metric.max : 0;
  }

  getMetricUnit(key: string): string {
    const metric = this.metrics.find(m => m.key === key);
    return metric ? metric.unit : '';
  }

  getMetricName(key: string): string {
    const metric = this.metrics.find(m => m.key === key);
    return metric ? metric.name : '';
  }

  generatePath(key: string): string {
    const values = this.getValues(key);
    const max = this.getMetricMax(key);

    if (values.length < 2) return '';

    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = (value / max) * 100;
      return `${x},${100 - y}`;
    });

    return 'M ' + points.join(' L ');
  }


  logout() {
    // Implement logout logic
    this.router.navigate(['/login']);
    this.isProfileDropdownOpen = false;
  }

  viewHistory() {
    this.router.navigate(['/dashboard']);
  }
}
