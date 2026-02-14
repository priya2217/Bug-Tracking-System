import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private PROJECTS_KEY = 'projects';

  constructor() {
    if (!localStorage.getItem(this.PROJECTS_KEY)) {
      const defaultProjects = [
        { projectId: 1, name: 'Website Redesign' },
        { projectId: 2, name: 'Mobile App' },
      ];
      localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(defaultProjects));
    }
  }

  getProjects() {
    return JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || '[]');
  }

  createProject(name: string) {
    const projects = this.getProjects();
    const newProject = { projectId: Date.now(), name };
    projects.push(newProject);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    return newProject;
  }
}
