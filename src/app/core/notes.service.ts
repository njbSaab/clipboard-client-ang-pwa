import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Note } from './models/note';
import { StorageService } from './storage.service';

@Injectable()
export class NotesService {
  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient, private storage: StorageService) {}

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl).pipe(
      tap((notes) => notes.forEach((note) => this.storage.addNote(note)))
    );
  }

  create(title: string, content: string): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, { title, content }).pipe(
      tap((note) => this.storage.addNote(note))
    );
  }

  toggleFavorite(id: string, favorite: boolean): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/favorite`, { favorite }).pipe(
      tap((note) => this.storage.addNote(note))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.storage.deleteNote(id)),
      catchError(() => {
        this.storage.deleteNote(id);
        return of(void 0);
      })
    );
  }
}