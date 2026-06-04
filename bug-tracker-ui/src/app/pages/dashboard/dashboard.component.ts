import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { ProjectService } from '../../services/project.service';
import { Bug } from '../../models/bug.models';

interface DashboardStats {
  totalBugs: number;
  openBugs: number;
  inProgressBugs: number;
  resolvedBugs: number;
  totalProjects: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalBugs: 0,
    openBugs: 0,
    inProgressBugs: 0,
    resolvedBugs: 0,
    totalProjects: 0,
  };

  recentBugs: Bug[] = [];
  projects: any[] = [];
  allBugs: Bug[] = [];

  constructor(
    private bugService: BugService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadBugs();
    this.loadProjects();
  }

  private loadBugs(): void {
    this.bugService.getAllBugs().subscribe({
      next: (bugs: Bug[]) => {
        this.allBugs = bugs || [];
        this.recentBugs = this.allBugs.slice(0, 5);
        this.calculateStats(this.allBugs);
      },
      error: (err) => {
        console.error('Error loading bugs:', err);
        this.allBugs = [];
        this.recentBugs = [];
        this.calculateStats([]);
      },
    });
  }

  private loadProjects(): void {
    try {
      const projects = this.projectService.getProjects();
      this.projects = projects ?? [];
      this.stats.totalProjects = this.projects.length;
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
      this.stats.totalProjects = 0;
    }
  }

  private calculateStats(bugs: Bug[]): void {
    this.stats = {
      totalBugs: bugs.length,
      openBugs: bugs.filter((b) => b.status === 'Open').length,
      inProgressBugs: bugs.filter((b) => b.status === 'In Progress').length,
      resolvedBugs: bugs.filter((b) => b.status === 'Resolved').length,
      totalProjects: this.projects.length,
    };
  }

  getProjectBugCount(projectId: number): number {
    return this.allBugs.filter((b) => b.projectId === projectId).length;
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? 'User';
  }
}
