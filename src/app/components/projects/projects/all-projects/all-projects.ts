import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../../services/project-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'projects',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule],
  templateUrl: './all-projects.html',
  styleUrl: './all-projects.css',
})
export class Projects {
  private projectService = inject(ProjectService);
  projectsList = this.projectService.projects;
  private router = inject(Router);

  ngOnInit() {
    this.projectService.getProjects().subscribe();
  }


  goToCreateTask(projectId: number) {
    this.router.navigate(['/projects', projectId, 'create-task']);
  }
  detailProject(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }
  goToCreateProject() {
    this.router.navigate(['/createProject']);
  }

}
