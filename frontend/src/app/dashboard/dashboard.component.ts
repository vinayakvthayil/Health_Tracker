import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthService } from '../core/services/health.service';
import { HealthRecord } from '../core/models/health.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50">
      <!-- Sidebar -->
      <aside class="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-30">
        <div class="flex items-center gap-3 p-6 border-b border-slate-200">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-heartbeat text-white text-xl"></i>
          </div>
          <span class="font-semibold text-slate-800">HealthTracker</span>
        </div>
        
        <nav class="p-4">
          <a href="#" class="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg font-medium">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <button (click)="viewHistory()" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium mt-2 w-full">
            <i class="fas fa-history"></i>
            <span>History</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="pl-64">
        <!-- Top Bar -->
        <header class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between relative">
          <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
          <div class="flex items-center gap-4">
<!--            <AlertDialog>-->
              <button
                  (click)="confirmSaveData()"
                  class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <i class="fas fa-save"></i>
                Save Data
              </button>
<!--              <alertDialogContent>-->
<!--                <div class="bg-white rounded-xl p-6 max-w-md mx-auto">-->
<!--                  <h2 class="text-xl font-semibold text-slate-800 mb-4">Confirm Save</h2>-->
<!--                  <p class="text-slate-600 mb-6">Are you sure you want to save today's health data? This will create a permanent record.</p>-->
<!--                  <div class="flex justify-end gap-4">-->
<!--                    <button-->
<!--                        alertDialogCancel-->
<!--                        class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"-->
<!--                    >-->
<!--                      Cancel-->
<!--                    </button>-->
<!--                    <button-->
<!--                        (click)="confirmSaveData()"-->
<!--                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"-->
<!--                    >-->
<!--                      Confirm Save-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </alertDialogContent>-->
<!--            </AlertDialog>-->

            <!-- Profile Dropdown -->
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
                    <i class="fas fa-history mr-2"></i>
                    Health History
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

        <!-- Dashboard Content -->
        <div class="p-8">
          <!-- Welcome Section -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-semibold text-slate-800">Welcome Back!</h2>
                <p class="text-slate-600 mt-1">Track your daily health metrics and reach your goals.</p>
              </div>
              <span class="text-sm text-slate-500">{{ currentDate | date:'EEEE, MMMM d' }}</span>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-4 gap-6 mt-6">
              <div class="bg-indigo-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-indigo-600">Daily Goal Progress</span>
                  <i class="fas fa-chart-line text-indigo-600"></i>
                </div>
                <p class="text-2xl font-bold text-slate-800">{{ calculateGoalProgress() }}%</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-green-600">Activity Level</span>
                  <i class="fas fa-running text-green-600"></i>
                </div>
                <p class="text-2xl font-bold text-slate-800">{{ calculateActivityLevel() }}</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-blue-600">Hydration Status</span>
                  <i class="fas fa-tint text-blue-600"></i>
                </div>
                <p class="text-2xl font-bold text-slate-800">{{ calculateHydrationStatus() }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-purple-600">Health Score</span>
                  <i class="fas fa-star text-purple-600"></i>
                </div>
                <p class="text-2xl font-bold text-slate-800">{{ calculateHealthScore() }}/10</p>
              </div>
            </div>
          </div>

          <!-- Main Metrics Grid -->
          <div class="grid grid-cols-3 gap-6 mb-8">
            <!-- Steps Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-walking text-indigo-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">Steps</h3>
                    <p class="text-sm text-slate-500">Daily Target: 10,000</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-slate-800">{{healthData.steps}}</p>
                  <p class="text-sm text-slate-500">steps</p>
                </div>
              </div>
              <input
                type="number"
                [(ngModel)]="healthData.steps"
                (change)="updateData()"
                class="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Enter steps"
              >
              <div class="mt-4">
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500"
                    [style.width.%]="(healthData.steps / 10000) * 100"
                    [class]="getProgressColorClass(healthData.steps, 10000)"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-sm text-slate-600">
                  <span>{{ ((healthData.steps / 10000) * 100).toFixed(1) }}% of goal</span>
                  <span>{{ 10000 - healthData.steps }} steps to go</span>
                </div>
              </div>
            </div>

            <!-- Calories Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-fire text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">Calories</h3>
                    <p class="text-sm text-slate-500">Daily Target: 2,500</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-slate-800">{{healthData.calories}}</p>
                  <p class="text-sm text-slate-500">kcal</p>
                </div>
              </div>
              <input
                type="number"
                [(ngModel)]="healthData.calories"
                (change)="updateData()"
                class="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Enter calories"
              >
              <div class="mt-4">
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500"
                    [style.width.%]="(healthData.calories / 2500) * 100"
                    [class]="getProgressColorClass(healthData.calories, 2500)"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-sm text-slate-600">
                  <span>{{ ((healthData.calories / 2500) * 100).toFixed(1) }}% of goal</span>
                  <span>{{ 2500 - healthData.calories }} kcal to go</span>
                </div>
              </div>
            </div>

            <!-- Heart Rate Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-heartbeat text-red-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">Heart Rate</h3>
                    <p class="text-sm text-slate-500">Normal: 60-100 BPM</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-slate-800">{{healthData.heartRate}}</p>
                  <p class="text-sm text-slate-500">BPM</p>
                </div>
              </div>
              <input
                type="number"
                [(ngModel)]="healthData.heartRate"
                (change)="updateData()"
                class="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Enter BPM"
              >
              <div class="mt-4">
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-center p-2 rounded-lg" [class]="getHeartRateZoneClass('low')">
                    <p class="text-sm font-medium">Low</p>
                    <p class="text-xs mt-1">Below 60</p>
                  </div>
                  <div class="text-center p-2 rounded-lg" [class]="getHeartRateZoneClass('normal')">
                    <p class="text-sm font-medium">Normal</p>
                    <p class="text-xs mt-1">60-100</p>
                  </div>
                  <div class="text-center p-2 rounded-lg" [class]="getHeartRateZoneClass('high')">
                    <p class="text-sm font-medium">High</p>
                    <p class="text-xs mt-1">Above 100</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sleep Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-moon text-indigo-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">Sleep</h3>
                    <p class="text-sm text-slate-500">Target: 8 hours</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-slate-800">{{healthData.sleep}}</p>
                  <p class="text-sm text-slate-500">hours</p>
                </div>
              </div>
              <input
                type="number"
                [(ngModel)]="healthData.sleep"
                (change)="updateData()"
                class="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Enter hours"
              >
              <div class="mt-4">
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500"
                    [style.width.%]="(healthData.sleep / 8) * 100"
                    [class]="getProgressColorClass(healthData.sleep, 8)"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-sm text-slate-600">
                  <span>{{ calculateSleepQuality() }}</span>
                  <span>{{ getOptimalSleepDifference() }}</span>
                </div>
              </div>
            </div>

            <!-- Water Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-tint text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800">Water</h3>
                    <p class="text-sm text-slate-500">Target: 2,500 ml</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-slate-800">{{healthData.water}}</p>
                  <p class="text-sm text-slate-500">ml</p>
                </div>
              </div>
              <input
                type="number"
                [(ngModel)]="healthData.water"
                (change)="updateData()"
                class="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Enter ml"
              >
              <div class="mt-4">
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500"
                    [style.width.%]="(healthData.water / 2500) * 100"
                    [class]="getProgressColorClass(healthData.water, 2500)"
                  ></div>
                </div>
                <div class="flex justify-between mt-2 text-sm text-slate-600">
                  <span>{{ ((healthData.water / 2500) * 100).toFixed(1) }}% of goal</span>
                  <span>{{ 2500 - healthData.water }} ml to go</span>
                </div>
              </div>
            </div>

            <!-- Health Insights Card -->
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <h3 class="font-semibold text-slate-800 mb-4">Daily Insights</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3 text-sm">
                  <i [class]="getInsightIcon('steps')" class="text-lg"></i>
                  <span>{{ getStepsInsight() }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <i [class]="getInsightIcon('calories')" class="text-lg"></i>
                  <span>{{ getCaloriesInsight() }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <i [class]="getInsightIcon('sleep')" class="text-lg"></i>
                  <span>{{ getSleepInsight() }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <i [class]="getInsightIcon('water')" class="text-lg"></i>
                  <span>{{ getWaterInsight() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievement Section -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <h3 class="font-semibold text-slate-800 mb-4">Today's Achievements</h3>
            <div class="grid grid-cols-4 gap-4">
              @for (achievement of getDailyAchievements(); track achievement.title) {
                <div class="text-center p-4 rounded-lg" [class]="achievement.completed ? 'bg-green-50' : 'bg-slate-50'">
                  <i [class]="achievement.icon + ' text-2xl ' + (achievement.completed ? 'text-green-600' : 'text-slate-400')"></i>
                  <p class="mt-2 text-sm font-medium" [class]="achievement.completed ? 'text-green-600' : 'text-slate-600'">
                    {{achievement.title}}
                  </p>
                  <p class="text-xs mt-1" [class]="achievement.completed ? 'text-green-500' : 'text-slate-500'">
                    {{achievement.description}}
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  healthData = {
    steps: 0,
    calories: 0,
    heartRate: 0,
    sleep: 0,
    water: 0
  };

  isProfileDropdownOpen = false;
  currentDate = new Date();

  constructor(
      private router: Router,
      private healthService: HealthService
  ) {
  }

  ngOnInit() {
    // Initial data load if needed
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  calculateGoalProgress(): number {
    const metrics = [
      this.healthData.steps / 10000,
      this.healthData.calories / 2500,
      this.healthData.water / 2500,
      this.healthData.sleep / 8
    ];
    const average = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    return Math.round(average * 100);
  }

  calculateActivityLevel(): string {
    const score = (this.healthData.steps / 10000) + (this.healthData.calories / 2500);
    if (score >= 1.8) return 'High';
    if (score >= 1.2) return 'Moderate';
    return 'Low';
  }

  calculateHydrationStatus(): string {
    const percentage = (this.healthData.water / 2500) * 100;
    if (percentage >= 90) return 'Optimal';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Fair';
    return 'Low';
  }

  calculateHealthScore(): number {
    const metrics = {
      steps: this.healthData.steps / 10000,
      calories: this.healthData.calories / 2500,
      water: this.healthData.water / 2500,
      sleep: this.healthData.sleep / 8
    };

    const weights = {steps: 0.3, calories: 0.2, water: 0.2, sleep: 0.3};
    const score = Object.entries(metrics).reduce((total, [key, value]) => {
      return total + (value * weights[key as keyof typeof weights] * 10);
    }, 0);

    return Math.min(Math.round(score), 10);
  }

  getProgressColorClass(value: number, target: number): string {
    const percentage = (value / target) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getHeartRateZoneClass(zone: 'low' | 'normal' | 'high'): string {
    const rate = this.healthData.heartRate;
    const baseClass = 'transition-colors duration-300 ';

    switch (zone) {
      case 'low':
        return baseClass + (rate < 60 ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600');
      case 'normal':
        return baseClass + (rate >= 60 && rate <= 100 ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-600');
      case 'high':
        return baseClass + (rate > 100 ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-600');
    }
  }

  calculateSleepQuality(): string {
    const hours = this.healthData.sleep;
    if (hours >= 7 && hours <= 9) return 'Optimal Sleep';
    if (hours >= 6) return 'Adequate Sleep';
    return 'Insufficient Sleep';
  }

  getOptimalSleepDifference(): string {
    const diff = 8 - this.healthData.sleep;
    if (diff > 0) return `${diff} hours short`;
    if (diff < 0) return `${Math.abs(diff)} hours extra`;
    return 'Optimal duration';
  }

  getInsightIcon(metric: string): string {
    const baseClass = 'fas fa-';
    let specific = '';

    switch (metric) {
      case 'steps':
        specific = this.healthData.steps >= 10000 ? 'check text-green-500' : 'info text-blue-500';
        break;
      case 'calories':
        specific = this.healthData.calories >= 2500 ? 'check text-green-500' : 'info text-blue-500';
        break;
      case 'sleep':
        specific = this.healthData.sleep >= 8 ? 'check text-green-500' : 'info text-blue-500';
        break;
      case 'water':
        specific = this.healthData.water >= 2500 ? 'check text-green-500' : 'info text-blue-500';
        break;
    }

    return baseClass + specific;
  }

  getDailyAchievements() {
    return [
      {
        title: '10K Steps',
        description: 'Walk 10,000 steps',
        icon: 'fas fa-walking',
        completed: this.healthData.steps >= 10000
      },
      {
        title: 'Hydration Goal',
        description: 'Drink 2.5L water',
        icon: 'fas fa-tint',
        completed: this.healthData.water >= 2500
      },
      {
        title: 'Calorie Target',
        description: 'Burn 2,500 calories',
        icon: 'fas fa-fire',
        completed: this.healthData.calories >= 2500
      },
      {
        title: 'Good Sleep',
        description: 'Sleep 8 hours',
        icon: 'fas fa-moon',
        completed: this.healthData.sleep >= 8
      }
    ];
  }

  updateData() {
  }

  saveData() {
    const record: HealthRecord = {
      date: new Date(),
      ...this.healthData
    };

    this.healthService.saveRecord(record).subscribe({
      next: () => {
        alert('Data saved successfully!');
        this.resetForm();
      },
      error: (error: Error) => {
        console.error('Failed to save data:', error);
        alert('Failed to save data. Please try again.');
      }
    });
  }

  getStepsInsight(): string {
    const steps = this.healthData.steps;
    if (steps === 0) return "Start walking to reach your daily goal of 10,000 steps";

    const percentage = (steps / 10000) * 100;
    if (percentage >= 100) {
      return `Great job! You've reached your daily goal of 10,000 steps`;
    } else if (percentage >= 75) {
      return `Almost there! Only ${10000 - steps} steps to reach your goal`;
    } else if (percentage >= 50) {
      return `You're halfway there! Keep moving to reach your goal`;
    } else if (percentage >= 25) {
      return `Good start! Try to take more frequent walks`;
    }
    return "Try to increase your daily steps for better health";
  }

  getCaloriesInsight(): string {
    const calories = this.healthData.calories;
    if (calories === 0) return "Start tracking your calorie burn to reach 2,500 kcal goal";

    const percentage = (calories / 2500) * 100;
    if (percentage >= 100) {
      return "Excellent! You've met your daily calorie burn target";
    } else if (percentage >= 75) {
      return `Good progress! ${2500 - calories} more calories to reach your goal`;
    } else if (percentage >= 50) {
      return "Keep up the activity to increase calorie burn";
    } else if (percentage >= 25) {
      return "Consider increasing your physical activity";
    }
    return "Try to be more active to increase calorie burn";
  }

  getSleepInsight(): string {
    const sleep = this.healthData.sleep;
    if (sleep === 0) return "Don't forget to log your sleep duration";

    if (sleep >= 7 && sleep <= 9) {
      return "Perfect! You're getting optimal sleep";
    } else if (sleep > 9) {
      return "You're sleeping more than recommended. Aim for 7-9 hours";
    } else if (sleep >= 6) {
      return "Try to get a bit more sleep for optimal rest";
    } else if (sleep < 6) {
      return "You're not getting enough sleep. Aim for 7-9 hours";
    }
    return "Log your sleep to get personalized insights";
  }

  getWaterInsight(): string {
    const water = this.healthData.water;
    if (water === 0) return "Start tracking your water intake to reach 2,500ml goal";

    const percentage = (water / 2500) * 100;
    if (percentage >= 100) {
      return "Excellent! You're well hydrated";
    } else if (percentage >= 75) {
      return `Almost there! ${2500 - water}ml more to reach your goal`;
    } else if (percentage >= 50) {
      return "Keep drinking water throughout the day";
    } else if (percentage >= 25) {
      return "Try to increase your water intake";
    }
    return "Remember to stay hydrated throughout the day";
  }

  confirmSaveData() {
    const record: HealthRecord = {
      date: new Date(),
      ...this.healthData
    };

    this.healthService.saveRecord(record).subscribe({
      next: () => {
        this.resetForm();
        this.isProfileDropdownOpen = false;
        // You might want to use a toast or snackbar instead of alert in a real app
        alert('Data saved successfully!');
      },
      error: (error: Error) => {
        console.error('Failed to save data:', error);
        alert('Failed to save data. Please try again.');
      }
    });
  }

  viewProfile() {
    // Navigate to profile page
    this.router.navigate(['/profile']);
    this.isProfileDropdownOpen = false;
  }


  private resetForm() {
    this.healthData = {
      steps: 0,
      calories: 0,
      heartRate: 0,
      sleep: 0,
      water: 0
    };
  }

  logout() {
    // Implement logout logic
    this.router.navigate(['/login']);
    this.isProfileDropdownOpen = false;
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }
}