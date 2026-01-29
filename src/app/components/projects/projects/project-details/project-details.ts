import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../services/project-service';
import { Project } from '../../../../models/project.model';
import { DatePipe, CommonModule } from '@angular/common';
import { TaskBoard } from '../../../Tasks/task-board/task-board';
import { MatIconModule } from '@angular/material/icon'; // Added Icon Module

@Component({
  selector: 'app-project-details',
  standalone: true, // Make sure styling works correctly
  imports: [CommonModule, DatePipe, TaskBoard, MatIconModule],
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