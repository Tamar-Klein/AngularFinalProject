import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Services
import { ProjectService } from '../../services/project-service';
import { TaskService } from '../../services/task-service';
import { TeamsService } from '../../services/teams-service';
import { AuthService } from '../../services/auth-service';

// Models & Enums
import { TaskStatus } from '../../models/enums/taskStatus';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private teamService = inject(TeamsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;
  projects = this.projectService.projects;
  tasks = this.taskService.tasks;
  teams = this.teamService.teams;

  // --- Statistics ---
  
  activeProjectsCount = computed(() => this.projects()?.length || 0);

  completedTasksCount = computed(() => 
    this.tasks()?.filter(t => t.status === TaskStatus.DONE).length || 0
  );

  pendingTasksCount = computed(() => 
    this.tasks()?.filter(t => t.status !== TaskStatus.DONE).length || 0
  );

  teamMembersCount = computed(() => {
    return this.teams()?.reduce((acc, team) => acc + (team.members_count || 0), 0) || 0;
  });

  // --- Recent Data ---

  recentProjects = computed(() => {
    // מביא את 3 הפרויקטים האחרונים (הנחה שהם מגיעים ממוינים או סתם הראשונים)
    return this.projects()?.slice(0, 3) || [];
  });

  upcomingTasks = computed(() => {
    return this.tasks()
      ?.filter(t => t.status !== TaskStatus.DONE)
      .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())
      .slice(0, 5) || [];
  });

  ngOnInit() {
    this.projectService.getProjects().subscribe();
    this.taskService.getTasks().subscribe();
    this.teamService.getTeams().subscribe();
  }

  createProject() {
    this.router.navigate(['/createProject']);
  }

  viewProject(id: number) {
    this.router.navigate(['/projects', id]);
  }

  // חישוב התקדמות פרויקט (Mock logic)
  getProjectProgress(projectId: number): number {
    const projectTasks = this.tasks()?.filter(t => t.project_id === projectId);
    if (!projectTasks || projectTasks.length === 0) return 0;
    
    const completed = projectTasks.filter(t => t.status === TaskStatus.DONE).length;
    return Math.round((completed / projectTasks.length) * 100);
  }
}