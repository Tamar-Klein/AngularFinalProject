import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = "http://localhost:3000/api/projects";
  private http = inject(HttpClient);


  private _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();



  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(projects => this._projects.set(projects))
    );
  }

  createProject({ name, teamId, description }: { name: string, teamId: number, description?: string }): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, { name, teamId, description }).pipe(
      tap(() => {
        this.getProjects().subscribe();
      })
    );
  }


}
