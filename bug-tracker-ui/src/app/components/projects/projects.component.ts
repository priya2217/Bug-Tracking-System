import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { BugService } from '../../services/bug.service';
import { Bug } from '../../models/bug.models';

export interface Project {
  projectId: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  bugs: Bug[] = [];
  newName = '';
  creating = false;

  constructor(
    private projectService: ProjectService,
    private bugService: BugService,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadBugs();
  }

  loadProjects() {
    this.projects = this.projectService.getProjects() || [];
  }

  loadBugs() {
    this.bugService.getAllBugs().subscribe({
      next: (bugs) => {
        this.bugs = bugs;
      },
      error: (err) => {
        console.error('Error loading bugs:', err);
        this.bugs = [];
      },
    });
  }

  getProjectBugCount(projectId: number): number {
    return this.bugs.filter((bug) => bug.projectId === projectId).length;
  }

  getProjectOpenBugs(projectId: number): number {
    return this.bugs.filter(
      (bug) => bug.projectId === projectId && bug.status === 'Open',
    ).length;
  }

  getProjectResolvedBugs(projectId: number): number {
    return this.bugs.filter(
      (bug) => bug.projectId === projectId && bug.status === 'Resolved',
    ).length;
  }

  createProject() {
    if (!this.newName.trim()) {
      alert('Please enter a project name');
      return;
    }

    this.creating = true;

    try {
      const added = this.projectService.createProject(this.newName.trim());
      this.newName = '';
      this.creating = false;
      this.loadProjects();
      alert(`✅ Project "${added.name}" created successfully!`);
    } catch (error) {
      this.creating = false;
      alert('Failed to create project. Please try again.');
    }
  }

  deleteProject(id: number) {
    const project = this.projects.find((p) => p.projectId === id);
    const bugCount = this.getProjectBugCount(id);

    let confirmMessage = `Delete project "${project?.name}"?`;
    if (bugCount > 0) {
      confirmMessage += `\n\n⚠️ Warning: This project has ${bugCount} bug(s). Deleting it may affect bug tracking.`;
    }

    const confirmDel = confirm(confirmMessage);
    if (!confirmDel) return;

    try {
      const current = this.projectService.getProjects() || [];
      const remaining = current.filter((p: any) => p.projectId !== id);
      localStorage.setItem('projects', JSON.stringify(remaining));
      this.loadProjects();
      alert('Project deleted successfully');
    } catch (error) {
      alert('Failed to delete project');
    }
  }
}
