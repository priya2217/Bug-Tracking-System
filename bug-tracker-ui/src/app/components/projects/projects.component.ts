import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';

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
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  newName = '';
  creating = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projects = this.projectService.getProjects() || [];
  }

  createProject() {
    if (!this.newName.trim()) {
      alert('Please enter a project name');
      return;
    }
    this.creating = true;
    const added = this.projectService.createProject(this.newName.trim());
    this.newName = '';
    this.creating = false;
    this.loadProjects();
    alert(`Project "${added.name}" created locally`);
  }

  deleteProject(id: number) {
    const confirmDel = confirm('Delete this local project?');
    if (!confirmDel) return;
    const current = this.projectService.getProjects() || [];
    const remaining = current.filter((p: any) => p.projectId !== id);
    localStorage.setItem('projects', JSON.stringify(remaining));
    this.loadProjects();
  }
}
