import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../core/models/note';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private apiUrl = 'https://app.njbsaab.tech/notes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  create(title: string, content: string): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, { title, content });
  }

  toggleFavorite(id: string, favorite: boolean): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/favorite`, { favorite });
  }

  update(id: string, title: string, content: string): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, { title, content });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}