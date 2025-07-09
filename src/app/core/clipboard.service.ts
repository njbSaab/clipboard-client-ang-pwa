import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ClipboardItem } from './models/clipboard-item';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private apiUrl = 'https://app.njbsaab.tech/clipboard'; // Замените на 'https://app.njbsaab.tech/clipboard' для продакшена

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.initClipboardListener();
  }

  private initClipboardListener() {
    window.addEventListener('copy', () => {
      this.ngZone.run(() => {
        navigator.clipboard.readText().then((text) => {
          if (text) {
            this.create(text).subscribe();
          }
        });
      });
    });
  }

  getAll(userId: string): Observable<ClipboardItem[]> {
    return this.http.get<ClipboardItem[]>(this.apiUrl, { params: { userId } }).pipe(
      catchError((error) => {
        console.error('Error fetching clipboard items:', error);
        return throwError(() => new Error('Failed to fetch clipboard items'));
      })
    );
  }

  create(content: string): Observable<ClipboardItem> {
    return this.http.post<ClipboardItem>(this.apiUrl, { content }).pipe(
      catchError((error) => {
        console.error('Error creating clipboard item:', error);
        return throwError(() => new Error('Failed to create clipboard item'));
      })
    );
  }

  toggleFavorite(id: string, favorite: boolean): Observable<ClipboardItem> {
    return this.http.patch<ClipboardItem>(`${this.apiUrl}/${id}/favorite`, { favorite }).pipe(
      catchError((error) => {
        console.error('Error toggling favorite:', error);
        return throwError(() => new Error('Failed to toggle favorite'));
      })
    );
  }

  getFrequent(userId: string): Observable<ClipboardItem[]> {
    return this.http.get<ClipboardItem[]>(`${this.apiUrl}/frequent`, { params: { userId } }).pipe(
      catchError((error) => {
        console.error('Error fetching frequent items:', error);
        return throwError(() => new Error('Failed to fetch frequent items'));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting clipboard item:', error);
        return throwError(() => new Error('Failed to delete clipboard item'));
      })
    );
  }

  incrementUsage(id: string): Observable<ClipboardItem> {
    return this.http.post<ClipboardItem>(`${this.apiUrl}/${id}/increment`, {}).pipe(
      catchError((error) => {
        console.error('Error incrementing usage:', error);
        return throwError(() => new Error('Failed to increment usage'));
      })
    );
  }

  updateSettings(userId: string, settings: { activeTab?: string; order?: string[]; isTextHidden?: Record<string, boolean> }): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/settings/${userId}`, settings).pipe(
      catchError((error) => {
        console.error('Error updating settings:', error);
        return throwError(() => new Error('Failed to update settings'));
      })
    );
  }

  getSettings(userId: string): Observable<{ activeTab: string; order: string[]; isTextHidden: Record<string, boolean> }> {
    return this.http.get<{ activeTab: string; order: string[]; isTextHidden: Record<string, boolean> }>(`${this.apiUrl}/settings/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching settings:', error);
        return of({ activeTab: 'all', order: [], isTextHidden: {} });
      })
    );
  }
}