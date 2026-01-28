import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comments } from '../../comments/comments';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task-service';
import { Router } from '@angular/router';
import { TaskStatus } from '../../../models/enums/taskStatus';
import { TaskPriority } from '../../../models/enums/taskPriority';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-board',
  imports: [FormsModule, Comments, DragDropModule,DatePipe],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
 projectId = input<number>(0);
 private taskService = inject(TaskService);
  private router = inject(Router);

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
    if (confirm('האם את בטוחה שברצונך למחוק את המשימה?')) {
      this.taskService.deleteTaskById(taskId).subscribe({
        next: () => {
             if (this.projectId()) {
                 this.taskService.getTasksByProjectId(this.projectId()).subscribe();
             } else {
                 this.taskService.getTasks().subscribe();
             }
        },
        error: (err) => alert('שגיאה: ' + err.message)
      });
    }
  }

  onUpdateStatus(taskId: number, newStatus: string) {
    this.taskService.patchTaskStatusById(taskId, newStatus).subscribe();
  }

  onUpdatePriority(taskId: number, event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const newPriority = selectedValue as TaskPriority;
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
}

