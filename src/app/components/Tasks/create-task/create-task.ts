import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  allProjects = this.projectService.projects;
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
    const user = this.authService.currentUser();
    const idFromUrl = this.route.snapshot.params['projectId'];

    this.projectService.getProjects().subscribe();

    if (idFromUrl) {
      this.createTaskForm.get('projectId')?.setValue(Number(idFromUrl));
      this.createTaskForm.get('projectId')?.disable();
    }
    else {
      this.createTaskForm.get('projectId')?.enable();
    }
  }



  onSubmit() {
    if (this.createTaskForm.valid) {
      this.taskService.createTask(this.createTaskForm.getRawValue() as any).subscribe({
        next: () => {
          alert('המשימה נוצרה בהצלחה!');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          alert('אירעה שגיאה ביצירת המשימה: ' + err.message);
        }
      });
    }
  }
}


