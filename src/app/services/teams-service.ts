import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Team } from '../models/team.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {

  private apiUrl = "http://localhost:3000/api/teams";
  private http = inject(HttpClient);

  private _teams = signal<Team[]>([]);
  readonly teams = this._teams.asReadonly();


getTeams(): Observable<Team[]> {
  return this.http.get<Team[]>(this.apiUrl).pipe(
    tap(teams => this._teams.set(teams)) 
  );
}
createTeam(name: string): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, { name }).pipe(
      tap(() => {
        this.getTeams().subscribe();
      })
    );
  }

    addUserToTeam(teamId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${teamId}/members`, { userId }).pipe(
      tap(() => {
        this.getTeams().subscribe();
      })
    );
  }

}
