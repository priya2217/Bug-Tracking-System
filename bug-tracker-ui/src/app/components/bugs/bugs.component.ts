import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { AuthService } from '../../services/auth.service';
import { Bug } from '../../models/bug.models';
import { ProjectService } from '../../services/project.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-bugs',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bugs.component.html',
})
export class BugComponent implements OnInit {
  bugs: Bug[] = [];
  filteredBugs: Bug[] = [];
  projects: { projectId: number; name: string }[] = [];
  showForm = false;
  loading = true;
  savingBug = false;
  filterStatus = 'all';

  bugForm: Bug = {
    title: '',
    description: '',
    status: 'Open',
    severity: 'Medium',
    projectId: 0,
    assigneeId: 1,
    creatorId: 0,
  };

  constructor(
    private bugService: BugService,
    private auth: AuthService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.loadBugs();
    this.loadProjects();
  }

  loadProjects() {
    try {
      this.projects = this.projectService.getProjects() || [];
    } catch (e) {
      this.projects = [];
    }
  }

  loadBugs() {
    this.loading = true;
    this.bugService.getAllBugs().subscribe({
      next: (b) => {
        this.bugs = b;
        this.filterBugs();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filterBugs() {
    if (this.filterStatus === 'all') {
      this.filteredBugs = [...this.bugs];
    } else {
      this.filteredBugs = this.bugs.filter(
        (bug) => bug.status === this.filterStatus,
      );
    }
  }

  getStatusCount(status: string): number {
    return this.bugs.filter((bug) => bug.status === status).length;
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find((p) => p.projectId === projectId);
    return project ? project.name : '';
  }

  openForm() {
    this.bugForm = {
      title: '',
      description: '',
      status: 'Open',
      severity: 'Medium',
      projectId: this.projects.length ? this.projects[0].projectId : 0,
      assigneeId: 1,
      creatorId: 0,
    };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  saveBug() {
    if (!this.bugForm.title.trim() || !this.bugForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!this.bugForm.projectId || this.bugForm.projectId === 0) {
      alert('Please select a project');
      return;
    }

    const userId = this.auth.getUserId();
    if (!userId || userId === 0) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    this.savingBug = true;
    this.bugForm.creatorId = userId;

    this.bugService.createBug(this.bugForm).subscribe({
      next: (response) => {
        alert('Bug reported successfully! 🎉');
        this.savingBug = false;
        this.closeForm();
        this.loadBugs();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating bug:', err);
        this.savingBug = false;
        alert(
          `Failed to create bug: ${err.error?.message || err.message || 'Unknown error'}`,
        );
      },
    });
  }

  updateBugStatus(bug: Bug, newStatus: string) {
    if (bug.status === newStatus) {
      return;
    }

    const updatedBug = { ...bug, status: newStatus };

    this.bugService.updateBug(bug.id!, updatedBug).subscribe({
      next: () => {
        alert(`Bug status updated to: ${newStatus}`);
        this.loadBugs();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating bug:', err);
        alert('Failed to update bug status');
      },
    });
  }

  deleteBug(bug: Bug) {
    if (confirm(`Delete "${bug.title}"?\n\nThis action cannot be undone.`)) {
      this.bugService.deleteBug(bug.id!).subscribe({
        next: () => {
          alert('Bug deleted successfully');
          this.loadBugs();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting bug:', err);
          alert('Failed to delete bug');
        },
      });
    }
  }
}
