import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { Bug, BugSummary } from '../../models/bug.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  bugs: Bug[] = [];
  summary: BugSummary = {
    totalBugs: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  };
  loading = true;

  constructor(
    private bugService: BugService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBugs();
    this.loadSummary();
  }

  loadBugs(): void {
    this.bugService.getAllBugs().subscribe({
      next: (data: Bug[]) => {
        this.bugs = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load bugs', err);
        this.loading = false;
      },
    });
  }

  loadSummary(): void {
    this.bugService.getBugSummary().subscribe({
      next: (data: BugSummary) => {
        this.summary = data;
      },
      error: (err: any) => {
        console.error('Failed to load summary', err);
        // Calculate summary from bugs if API fails
        this.calculateSummaryFromBugs();
      },
    });
  }

  private calculateSummaryFromBugs(): void {
    this.summary = {
      totalBugs: this.bugs.length,
      open: this.bugs.filter((b) => b.status === 'Open').length,
      inProgress: this.bugs.filter((b) => b.status === 'In Progress').length,
      resolved: this.bugs.filter((b) => b.status === 'Resolved').length,
    };
  }

  navigateToBugs(): void {
    this.router.navigate(['/bugs']);
  }
}
