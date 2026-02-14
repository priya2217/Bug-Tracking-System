import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BugComponent } from './components/bugs/bugs.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bugs', component: BugComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'profile', component: ProfileComponent },
];
