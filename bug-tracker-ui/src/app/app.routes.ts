import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BugComponent } from './components/bugs/bugs.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardComponent } from './components/board/board.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bugs', component: BugComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'board', component: BoardComponent },
  { path: 'reports', component: ReportsComponent},
  { path: 'profile', component: ProfileComponent },
];
