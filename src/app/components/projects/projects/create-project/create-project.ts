import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project-service';
import { Router } from '@angular/router';
import { TeamsService } from '../../../../services/teams-service';

@Component({
  selector: 'app-create-project',
  imports: [ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class createProject  {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService)
  private router = inject(Router);
  private teamService = inject(TeamsService);

  createProjectForm = this.fb.nonNullable.group({
    teamId: ['', Validators.required],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });
  ngOnInit() {
this.teamService.getTeams().subscribe(teams => {
  }); }
 isTeamIdInvalid() {
    const control = this.createProjectForm.get('teamId');
    if (!control || !control.value || control.pristine) return false;
    
    const exists = this.teamService.teams().some(team => team.id === Number(control.value));
    return !exists;
    
  }
  onSubmit() {
 if (this.createProjectForm.valid&&!this.isTeamIdInvalid()) {
      const { teamId, name, description } = this.createProjectForm.getRawValue();
      this.projectService.createProject({ teamId: Number(teamId), name, description }).subscribe({
        next: (response) => {
          alert("the project was created successfully!");
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          console.error('Create project failed', err);
          alert('error ' + (err.error?.message || 'unknown error'));
        }
      });
    }
  }
}
