import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comments } from '../../comments/comments';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task-service';
import { Router } from '@angular/router';
import { TaskStatus } from '../../../models/enums/taskStatus';
import { TaskPriority } from '../../../models/enums/taskPriority';
import { CommonModule, DatePipe } from '@angular/common';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    Comments, 
    DragDropModule, 
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard implements OnInit {
  projectId = input<number>(0);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar); // UI Feedback

  taskList = this.taskService.tasks;
  
  protected readonly taskStatus = TaskStatus;
  protected readonly taskPriority = TaskPriority;
  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  boardColumns = computed(() => {
    let tasks = this.taskList();

    if (this.projectId()) {
      tasks = tasks.filter(t => t.project_id === this.projectId());
    }

    const columns: Record<string, Task[]> = {};
    this.statusOptions.forEach(status => columns[status] = []);

    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].push(task);
      }
    });

    return columns;
  });

  ngOnInit() {
    if (this.projectId()) {
      this.taskService.getTasksByProjectId(this.projectId()).subscribe();
    } else {
      this.taskService.getTasks().subscribe();
    }
  }

  goToCreateTask() {
    if (this.projectId()) {
      this.router.navigate(['/projects', this.projectId(), 'create-task']);
    } else {
      this.router.navigate(['/createTask']);
    }
  }

  onDeleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTaskById(taskId).subscribe({
        next: () => {
          if (this.projectId()) {
             this.taskService.getTasksByProjectId(this.projectId()).subscribe();
          } else {
             this.taskService.getTasks().subscribe();
          }
          this.showSuccess('Task deleted successfully');
        },
        error: (err) => this.showError('Error: ' + err.message)
      });
    }
  }

  onUpdateStatus(taskId: number, newStatus: string) {
    this.taskService.patchTaskStatusById(taskId, newStatus).subscribe();
  }

  // Updated to support Material Select
  onUpdatePriority(taskId: number, newPriority: TaskPriority) {
    this.taskService.patchTaskPriorityById(taskId, newPriority).subscribe();
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const task = event.container.data[event.currentIndex];
      this.updateTaskStatus(task, event.container.id);
    }
  }

  updateTaskStatus(task: Task, newStatusId: string) {
    this.taskService.patchTaskStatusById(task.id!, newStatusId).subscribe();
  }

  // UI Helper for Priority Colors
  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH: return 'warn';
      case TaskPriority.MEDIUM: return 'accent';
      case TaskPriority.LOW: return 'primary';
      default: return '';
    }
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['error-snackbar'] });
  }
}