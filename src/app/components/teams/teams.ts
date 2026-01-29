import { Component, inject, OnInit } from '@angular/core';
import { TeamsService } from '../../services/teams-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams implements OnInit {

  private teamsService = inject(TeamsService);
  private snackBar = inject(MatSnackBar); // הזרקת ה-SnackBar

  teamsList = this.teamsService.teams;
  isCreating = false;
  newTeamName = '';
  openedInvites = new Set<number>();

  ngOnInit() {
    this.teamsService.getTeams().subscribe();
  }

  toggleCreate() {
    this.isCreating = !this.isCreating;
    this.newTeamName = '';
  }

  saveTeam() {
    if (this.newTeamName) {
      this.teamsService.createTeam(this.newTeamName).subscribe(() => {
        this.isCreating = false;
        this.showSuccess('Team created successfully! 🚀');
      });
    }
  }

  addUser(teamId: number, userId: string) {
    if (!userId) {
      this.showError("Please enter a valid user ID");
      return;
    }
    this.teamsService.addUserToTeam(teamId, Number(userId)).subscribe({
      next: () => {
        this.toggleInvite(teamId);
        this.showSuccess("User added successfully! 🎉");
      },
      error: (err) => {
        console.error('Server error details:', err);
        if (err.status === 500) {
          this.showError("User not found or already in team.");
        } else {
          this.showError("Connection error. Please try again.");
        }
      }
    });
  }

  toggleInvite(teamId: number) {
    if (this.openedInvites.has(teamId)) {
      this.openedInvites.delete(teamId);
    } else {
      this.openedInvites.add(teamId);
    }
  }

  isOnlyNumbers(value: string): boolean {
    return /^\d+$/.test(value);
  }

  // --- Proactive Helper Methods for SnackBar ---
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'], // עיצוב ירוק (מוגדר ב-styles.css הגלובלי)
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'], // עיצוב אדום (מוגדר ב-styles.css הגלובלי)
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}