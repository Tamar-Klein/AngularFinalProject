import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project-service';
import { Router, RouterLink } from '@angular/router'; // הוספתי RouterLink לכפתור ביטול
import { TeamsService } from '../../../../services/teams-service';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject  {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private teamService = inject(TeamsService);
  private snackBar = inject(MatSnackBar); // UI improvement

  createProjectForm = this.fb.nonNullable.group({
    teamId: ['', Validators.required],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => {
    });
  }

  isTeamIdInvalid() {
    const control = this.createProjectForm.get('teamId');
    if (!control || !control.value || control.pristine) return false;

    const exists = this.teamService.teams().some(team => team.id === Number(control.value));
    return !exists;
  }

  onSubmit() {
    if (this.createProjectForm.valid && !this.isTeamIdInvalid()) {
      const { teamId, name, description } = this.createProjectForm.getRawValue();
      
      this.projectService.createProject({ teamId: Number(teamId), name, description }).subscribe({
        next: (response) => {
          this.showSuccess("The project was created successfully! 🚀");
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          console.error('Create project failed', err);
          const errorMsg = err.error?.message || 'Unknown error occurred';
          this.showError('Error: ' + errorMsg);
        }
      });
    }
  }

  // --- Helpers for SnackBar ---
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}