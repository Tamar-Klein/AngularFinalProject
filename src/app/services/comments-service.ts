import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Comments } from '../models/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://tasks-teacher-server.onrender.com/api/comments';

  private _comments = signal<Comments[]>([]);
  readonly comments = this._comments.asReadonly();

  getCommentsByTaskId(taskId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.apiUrl}?taskId=${taskId}`).pipe(
      tap(data => this._comments.set(data))
    );
  }

  addComment(taskId: number, body: string): Observable<Comments> {
    const data = { taskId, body };
    return this.http.post<Comments>(this.apiUrl, data).pipe(
      tap(newComment => {
        this._comments.set([...this.comments(), newComment]);
      })
    );
  }
}
