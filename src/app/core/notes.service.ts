import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note } from './models/note';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private apiUrl = 'https://clipboard-hono-fapp.sdr-expert.workers.dev/notes';

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Note[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Note[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        return throwError(() => new Error('Failed to fetch notes'));
      })
    );
  }

  create(title: string, content: string): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, { title, content }).pipe(
      catchError((error) => {
        console.error('Error creating note:', error);
        return throwError(() => new Error('Failed to create note'));
      })
    );
  }

  toggleFavorite(id: string, favorite: boolean): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/favorite`, { favorite }).pipe(
      catchError((error) => {
        console.error('Error toggling favorite:', error);
        return throwError(() => new Error('Failed to toggle favorite'));
      })
    );
  }

  update(id: string, title: string, content: string): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, { title, content }).pipe(
      catchError((error) => {
        console.error('Error updating note:', error);
        return throwError(() => new Error('Failed to update note'));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting note:', error);
        return throwError(() => new Error('Failed to delete note'));
      })
    );
  }
}