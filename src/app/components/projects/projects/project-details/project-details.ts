import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../services/project-service';
import { TaskService } from '../../../../services/task-service';
import { Project } from '../../../../models/project.model';
import { DatePipe } from '@angular/common';
import { Comments } from '../../../comments/comments';
import { TaskStatus } from '../../../../models/enums/taskStatus';
import { TaskPriority } from '../../../../models/enums/taskPriority';
import { TaskBoard } from '../../../Tasks/task-board/task-board';

@Component({
  selector: 'app-project-details',
  imports: [DatePipe,TaskBoard],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails {
 private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);

  project = signal<Project | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('projectId'));

    this.projectService.getProjects().subscribe(() => {
      const found = this.projectService.projects().find(p => p.id === id);
      if (found) {
        this.project.set(found);
      }
    });
  }
}
