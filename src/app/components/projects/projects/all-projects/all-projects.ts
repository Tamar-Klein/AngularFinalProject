import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../../services/project-service';
import { Router } from '@angular/router';

@Component({
  selector: 'projects',
  imports: [],
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

}
