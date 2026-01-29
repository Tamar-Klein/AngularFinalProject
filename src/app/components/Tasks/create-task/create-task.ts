import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project-service';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  allProjects = this.projectService.projects;
  private user = this.authService.currentUser();

  createTaskForm = this.fb.group({
    projectId: [null as number | null, Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['todo', Validators.required],
    priority: ['medium', Validators.required],
    assigneeId: [this.user ? this.user.id : null],
    dueDate: [null],
    orderIndex: [0]
  });

  ngOnInit() {
    const idFromUrl = this.route.snapshot.params['projectId'];

    this.projectService.getProjects().subscribe();

    if (idFromUrl) {
      this.createTaskForm.get('projectId')?.setValue(Number(idFromUrl));
      this.createTaskForm.get('projectId')?.disable();
    } else {
      this.createTaskForm.get('projectId')?.enable();
    }
  }

  onSubmit() {
    if (this.createTaskForm.valid) {
      this.taskService.createTask(this.createTaskForm.getRawValue() as any).subscribe({
        next: () => {
          this.showSuccess('Task created successfully! 🎉');
          const currentProjectId = this.createTaskForm.getRawValue().projectId;
          if (currentProjectId) {
            this.router.navigate(['/projects', currentProjectId]);
          } else {
            this.router.navigate(['/tasks']);
          }
        },
        error: (err) => {
          this.showError('Error creating task: ' + err.message);
        }
      });
    }
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'], verticalPosition: 'top' });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'], verticalPosition: 'top' });
  }
}