import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private apiUrl = "https://tasks-teacher-server.onrender.com/api/tasks";
  private http = inject(HttpClient);


  private _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();


  getTasks() :Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this._tasks.set(tasks))
      );
  }
  getTasksByProjectId(projectId: number): Observable<Task[]> {
    const params = new HttpParams().set('projectId', projectId);

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      tap(tasks => this._tasks.set(tasks)) 
    );
  }
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(createdTask => {
        this._tasks.update(tasks => [...tasks, createdTask]);
      })
      );
  }
  deleteTaskById(taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(t => t.id !== taskId));
      })
      );
  }
  patchTaskStatusById(taskId: number, status: string): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.patch<Task>(url, {status}).pipe(
      tap((updatedTask) => {
        this._tasks.update(tasks => tasks.map(t => t.id === taskId ? updatedTask : t));
      }
      ) );
  } 
  patchTaskPriorityById(taskId: number, priority: string): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.patch<Task>(url, {priority}).pipe(
      tap((updatedTask) => {
        this._tasks.update(tasks => tasks.map(t => t.id === taskId ? updatedTask : t));
      }
      ) );
  } 


}
