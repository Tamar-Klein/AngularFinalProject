import { Component, computed, inject, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private teamService = inject(TeamsService); 

  private router = inject(Router); 
  private snackBar = inject(MatSnackBar);
  
  protected teams = this.teamService.teams; 

  isLoading = false;

  createProjectForm = this.fb.nonNullable.group({
    teamId: ['', [Validators.required]], // כבר לא צריך pattern, כי זה Select
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
  });

  ngOnInit() {
    this.teamService.getTeams().subscribe();
  }

  onSubmit() {
    if (this.createProjectForm.valid) {
      this.isLoading = true;
      const formValue = this.createProjectForm.getRawValue();
      this.projectService.createProject({
        ...formValue,
        teamId: Number(formValue.teamId)
      }).subscribe({
       next: () => {
          this.isLoading = false; 
          this.snackBar.open('Project created successfully! 🚀', 'Close', { duration: 3000 });
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.isLoading = false; 
          this.snackBar.open('Failed to create project', 'Close', { duration: 5000 });
        }
      });
    }
  }
}