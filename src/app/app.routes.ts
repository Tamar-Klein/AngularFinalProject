import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Teams } from './components/teams/teams';
import { Projects } from './components/projects/projects/all-projects/all-projects';
import { CreateProject } from './components/projects/projects/create-project/create-project';
import { CreateTask } from './components/Tasks/create-task/create-task';
import { ProjectDetails } from './components/projects/projects/project-details/project-details';
import { authGuard } from './guards/auth-guard';
import { LandingPage } from './components/landing-page/landing-page';
import { MainLayout } from './layout/main-layout/main-layout';
import { TaskBoard } from './components/Tasks/task-board/task-board';
import { Dashboard } from './components/dashboard/dashboard';
import { NotFound } from './components/not-found/not-found';
import { guestGuard } from './guards/guest-guard-guard';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';

export const routes: Routes = [
    {
        path: '', pathMatch: 'full',
        redirectTo: () => {
            const authService = inject(AuthService);
            return authService.isLoggedIn() || authService.getToken() ? 'dashboard' : 'landingPage';
        }
    }, { path: 'landingPage', component: LandingPage, canActivate: [guestGuard] },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'teams', component: Teams },
            { path: 'projects', component: Projects },
            { path: 'createProject', component: CreateProject },
            { path: 'tasks', component: TaskBoard },
            { path: 'createTask', component: CreateTask },
            { path: 'projects/:projectId', component: ProjectDetails },
            { path: 'projects/:projectId/create-task', component: CreateTask },
            { path: 'projects/:projectId/tasks', component: TaskBoard },
            { path: "dashboard", component: Dashboard }
        ]
    },
    { path: '404', component: NotFound },
    { path: '**', redirectTo: '404' }
];
