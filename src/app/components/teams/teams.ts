import { Component, inject } from '@angular/core';
import { TeamsService } from '../../services/teams-service';
import { FormsModule } from '@angular/forms';
import { Team } from '../../models/team.model';

@Component({
  selector: 'teams',
  imports: [FormsModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {

  private teamsService = inject(TeamsService);
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
      });
    }
  }
  addUser(teamId: number, userId: string) {
    if (!userId) {
      alert("please enter a valid user ID");
      return;
    }
    this.teamsService.addUserToTeam(teamId, Number(userId)).subscribe({
      next: () => {
        this.toggleInvite(teamId);
        alert("Added successfully!");

      },
      error: (err) => {
        console.error('Server error details:', err);

      if (err.status === 500) {
        alert("User not found or already in team. Please check the ID.");
      } else {
        alert("A connection error occurred. Please try again later.");
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
}






