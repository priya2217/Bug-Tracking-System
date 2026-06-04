import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { ProjectService } from '../../services/project.service';
import { Bug } from '../../models/bug.models';

interface Analytics {
  totalBugs: number;
  openBugs: number;
  inProgressBugs: number;
  resolvedBugs: number;
  previousTotalBugs: number;
  resolutionRate: number;
  avgResolutionTime: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'], 
})
export class ReportsComponent implements OnInit {
  bugs: Bug[] = [];
  projects: any[] = [];
  dateRange = '30';
  loading: boolean = false; // ✅ FIXED

  analytics: Analytics = {
    totalBugs: 0,
    openBugs: 0,
    inProgressBugs: 0,
    resolvedBugs: 0,
    previousTotalBugs: 0,
    resolutionRate: 0,
    avgResolutionTime: 0,
  };

  topProjects: any[] = [];
  recentActivities: any[] = [];
  topContributors: any[] = [];
  trendData: any[] = [];
  insights: any[] = [];
  recommendations: any[] = [];

  constructor(
    private bugService: BugService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ===========================
  // MAIN DATA LOADER
  // ===========================

  loadData(): void {
    this.loading = true;

    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        console.log('API Bugs:', bugs);
        this.bugs = bugs || [];

        this.projects = this.projectService.getProjects() || [];

        this.calculateAnalytics();
        this.calculateTopProjects();
        this.generateRecentActivities();
        this.calculateTopContributors();
        this.generateTrendData();
        this.generateInsights();
        this.generateRecommendations();

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bugs:', err);
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  onDateRangeChange(): void {
    this.loadData();
  }

  // ===========================
  // ANALYTICS
  // ===========================

  calculateAnalytics(): void {
    this.analytics.totalBugs = this.bugs.length;

    this.analytics.openBugs = this.bugs.filter(
      (b) => b.status?.toLowerCase() === 'open',
    ).length;

    this.analytics.inProgressBugs = this.bugs.filter(
      (b) => b.status?.toLowerCase() === 'in progress',
    ).length;

    this.analytics.resolvedBugs = this.bugs.filter(
      (b) => b.status?.toLowerCase() === 'resolved',
    ).length;

    this.analytics.resolutionRate =
      this.analytics.totalBugs > 0
        ? Math.round(
            (this.analytics.resolvedBugs / this.analytics.totalBugs) * 100,
          )
        : 0;

    this.analytics.avgResolutionTime = this.calculateAvgResolutionTime();
    this.analytics.previousTotalBugs = Math.round(
      this.analytics.totalBugs * 0.8,
    );
  }

  calculateAvgResolutionTime(): number {
    const resolved = this.bugs.filter(
      (b) => b.status?.toLowerCase() === 'resolved',
    );

    if (resolved.length === 0) return 0;

    let totalDays = 0;

    resolved.forEach((bug) => {
      if (bug.createdDate && bug.updatedDate) {
        const created = new Date(bug.createdDate).getTime();
        const updated = new Date(bug.updatedDate).getTime();
        const diffDays = Math.floor(
          (updated - created) / (1000 * 60 * 60 * 24),
        );
        totalDays += diffDays;
      }
    });

    return Math.round(totalDays / resolved.length);
  }

  // ===========================
  // TOP PROJECTS
  // ===========================

  calculateTopProjects(): void {
    const map = new Map<number, number>();

    this.bugs.forEach((bug) => {
      if (!bug.projectId) return;
      map.set(bug.projectId, (map.get(bug.projectId) || 0) + 1);
    });

    this.topProjects = Array.from(map.entries())
      .map(([id, count]) => {
        const project = this.projects.find((p) => p.projectId === id);
        return {
          id,
          name: project?.name || `Project ${id}`,
          bugCount: count,
        };
      })
      .sort((a, b) => b.bugCount - a.bugCount)
      .slice(0, 5);
  }

  // ===========================
  // RECENT ACTIVITY
  // ===========================

  generateRecentActivities(): void {
    this.recentActivities = [];

    const sorted = [...this.bugs]
      .sort(
        (a, b) =>
          new Date(b.createdDate || '').getTime() -
          new Date(a.createdDate || '').getTime(),
      )
      .slice(0, 5);

    sorted.forEach((bug) => {
      this.recentActivities.push({
        type: bug.status?.toLowerCase() === 'resolved' ? 'resolved' : 'created',
        message: `Bug "${bug.title}"`,
        time: this.getRelativeTime(bug.updatedDate || bug.createdDate),
      });
    });
  }

  // ===========================
  // TOP CONTRIBUTORS
  // ===========================

  calculateTopContributors(): void {
    const map = new Map<number, number>();

    this.bugs
      .filter((b) => b.status?.toLowerCase() === 'resolved')
      .forEach((b) => {
        if (!b.creatorId) return;
        map.set(b.creatorId, (map.get(b.creatorId) || 0) + 1);
      });

    this.topContributors = Array.from(map.entries())
      .map(([id, count]) => ({
        name: `User ${id}`,
        resolvedCount: count,
      }))
      .sort((a, b) => b.resolvedCount - a.resolvedCount)
      .slice(0, 5);
  }

  // ===========================
  // TREND DATA
  // ===========================

  generateTrendData(): void {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    this.trendData = last7Days.map((date) => {
      const label = date.toLocaleDateString('en-US', {
        weekday: 'short',
      });

      const created = this.bugs.filter(
        (b) =>
          b.createdDate &&
          new Date(b.createdDate).toDateString() === date.toDateString(),
      ).length;

      const resolved = this.bugs.filter(
        (b) =>
          b.updatedDate &&
          b.status?.toLowerCase() === 'resolved' &&
          new Date(b.updatedDate).toDateString() === date.toDateString(),
      ).length;

      return { label, created, resolved };
    });
  }

  // ===========================
  // INSIGHTS & RECOMMENDATIONS
  // ===========================

  generateInsights(): void {
    this.insights = [];

    if (this.analytics.resolutionRate < 50) {
      this.insights.push({
        icon: '⚠️',
        title: 'Low Resolution Rate',
        description: 'Consider focusing more on fixing bugs.',
      });
    }

    if (this.analytics.totalBugs === 0) {
      this.insights.push({
        icon: '📭',
        title: 'No Bugs Yet',
        description: 'Your system currently has no bug records.',
      });
    }

    if (this.insights.length === 0) {
      this.insights.push({
        icon: '📈',
        title: 'Healthy Metrics',
        description: 'Your bug tracking looks stable.',
      });
    }
  }

  generateRecommendations(): void {
    this.recommendations = [];

    if (this.analytics.openBugs > 5) {
      this.recommendations.push({
        icon: '🔥',
        title: 'Reduce Open Bugs',
        description: 'Focus on closing open tickets.',
      });
    }

    if (this.recommendations.length === 0) {
      this.recommendations.push({
        icon: '✨',
        title: 'Maintain Workflow',
        description: 'Keep maintaining your current process.',
      });
    }
  }

  // ===========================
  // HELPERS
  // ===========================

  getRelativeTime(date?: Date): string {
    if (!date) return 'Recently';

    const diff = new Date().getTime() - new Date(date).getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;

    return 'Today';
  }
}
