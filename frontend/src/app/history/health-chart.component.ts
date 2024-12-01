import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
    selector: 'app-health-chart',
    standalone: true,
    template: `
        <div class="w-full h-[400px]">
            <canvas #healthChart></canvas>
        </div>
    `
})
export class HealthChartComponent implements OnInit {
    @ViewChild('healthChart') healthChart: ElementRef;
    chart: Chart;
    @Input() metric!: string;

    // Sample health records (replace with your actual data source)
    healthRecords = [
        { date: new Date('2024-01-01'), calories: 2000, steps: 5000, water: 2500, sleep: 7, heart_rate: 72 },
        // Add more records...
    ];

    // Available metrics
    metrics = ['calories', 'steps', 'water', 'sleep', 'heart_rate'];
    selectedMetric = 'calories';

    constructor() {
        Chart.register(...registerables);
    }

    ngOnInit() {
        this.createChart();
    }

    createChart() {
        const ctx = this.healthChart.nativeElement.getContext('2d');

        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: this.healthRecords.map(record =>
                    new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                ),
                datasets: [{
                    label: this.selectedMetric.charAt(0).toUpperCase() + this.selectedMetric.slice(1),
                    data: this.healthRecords.map(record => record[this.selectedMetric]),
                    borderColor: this.getMetricColor(this.selectedMetric),
                    backgroundColor: this.getMetricColor(this.selectedMetric) + '33',
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: this.getMetricUnit(this.selectedMetric)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${this.selectedMetric}: ${context.formattedValue} ${this.getMetricUnit(this.selectedMetric)}`;
                            }
                        }
                    }
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    // Metric-related utility methods
    getMetricColor(metric: string): string {
        const colors = {
            calories: '#FF6384',
            steps: '#36A2EB',
            water: '#4BC0C0',
            sleep: '#9966FF',
            heart_rate: '#FF9F40'
        };
        return colors[metric] || '#000';
    }

    getMetricUnit(metric: string): string {
        const units = {
            calories: 'kcal',
            steps: 'steps',
            water: 'ml',
            sleep: 'hrs',
            heart_rate: 'bpm'
        };
        return units[metric] || '';
    }

    // Method to change displayed metric
    changeMetric(metric: string) {
        this.selectedMetric = metric;
        this.updateChart();
    }

    updateChart() {
        if (this.chart) {
            this.chart.data.datasets[0].label = this.selectedMetric.charAt(0).toUpperCase() + this.selectedMetric.slice(1);
            this.chart.data.datasets[0].data = this.healthRecords.map(record => record[this.selectedMetric]);
            this.chart.data.datasets[0].borderColor = this.getMetricColor(this.selectedMetric);
            this.chart.data.datasets[0].backgroundColor = this.getMetricColor(this.selectedMetric) + '33';

            this.chart.options.scales.y.title.text = this.getMetricUnit(this.selectedMetric);

            this.chart.update();
        }
    }
}