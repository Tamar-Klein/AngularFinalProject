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

export const routes: Routes = [
    { path: '', redirectTo: 'landingPage', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'landingPage', component: LandingPage },
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
            {path: 'projects/:projectId/tasks', component: TaskBoard},
            {path:"dashboard", component: Dashboard}
        ]
    },
];
