import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugService } from '../../services/bug.service';
import { AuthService } from '../../services/auth.service';
import { Bug } from '../../models/bug.models';
import { ProjectService } from '../../services/project.service';

@Component({
  standalone: true,
  selector: 'app-bugs',
  imports: [CommonModule, FormsModule],
  templateUrl: './bugs.component.html',
})
export class BugComponent implements OnInit {
  bugs: Bug[] = [];
  projects: { projectId: number; name: string }[] = [];
  showForm = false;
  loading = true;
  savingBug = false;

  bugForm: Bug = {
    title: '',
    description: '',
    status: 'Open',
    severity: 'Low',
    projectId: 0,
    assigneeTo: 1,
    creatorBy: 0,
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openForm() {
    this.bugForm = {
      title: '',
      description: '',
      status: 'Open',
      severity: 'Low',
      projectId: this.projects.length ? this.projects[0].projectId : 0,
      assigneeTo: 1,
      creatorBy: 0,
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

    const userId = this.auth.getUserId();
    if (!userId || userId === 0) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    this.savingBug = true;
    this.bugForm.creatorBy = userId;
    console.log('Saving bug:', this.bugForm);

    this.bugService.createBug(this.bugForm).subscribe({
      next: (response) => {
        console.log('Bug created successfully:', response);
        alert('Bug created successfully!');
        this.savingBug = false;
        this.closeForm();
        this.loadBugs();
      },
      error: (err) => {
        console.error('Error creating bug:', err);
        console.error('Error details:', err.error);
        this.savingBug = false;
        alert(
          `Failed to create bug: ${err.error?.message || err.message || 'Unknown error'}`,
        );
      },
    });
  }

  deleteBug(bug: Bug) {
    if (confirm(`Are you sure you want to delete "${bug.title}"?`)) {
      this.bugService.deleteBug(bug.id!).subscribe(() => this.loadBugs());
    }
  }
}
