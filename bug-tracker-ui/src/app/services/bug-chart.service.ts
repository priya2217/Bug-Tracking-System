import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Bug } from '../models/bug.models';

@Injectable({ providedIn: 'root' })
export class BugChartService {
  createStatusChart(elementId: string, bugs: Bug[]) {
    const ctx = document.getElementById(elementId) as HTMLCanvasElement;

    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Open', 'In Progress', 'Resolved'],
        datasets: [
          {
            data: [
              bugs.filter((b) => b.status === 'Open').length,
              bugs.filter((b) => b.status === 'In Progress').length,
              bugs.filter((b) => b.status === 'Resolved').length,
            ],
          },
        ],
      },
    });
  }

  createTrendChart(elementId: string, trendData: any[]) {
    const ctx = document.getElementById(elementId) as HTMLCanvasElement;

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.map((t) => t.label),
        datasets: [
          {
            label: 'Created',
            data: trendData.map((t) => t.created),
          },
          {
            label: 'Resolved',
            data: trendData.map((t) => t.resolved),
          },
        ],
      },
    });
  }
}
