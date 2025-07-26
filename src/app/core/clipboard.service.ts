import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ClipboardItem } from './models/clipboard-item';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private apiUrl = 'https://clipboard-hono-fapp.sdr-expert.workers.dev/clipboard';
  private userId = '0d35df3f-25ad-425b-86cb-fa7b21626544'; // TODO: Получать из localStorage или сервиса авторизации

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
        }).catch((error) => {
          console.error('Error reading clipboard:', error);
        });
      });
    });
  }

  getAll(search?: string): Observable<ClipboardItem[]> {
    let params = new HttpParams().set('userId', this.userId);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ClipboardItem[]>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching clipboard items:', error);
        return throwError(() => new Error('Failed to fetch clipboard items'));
      })
    );
  }

  create(content: string): Observable<ClipboardItem> {
    return this.http.post<ClipboardItem>(this.apiUrl, { content, userId: this.userId }).pipe(
      catchError((error) => {
        console.error('Error creating clipboard item:', error);
        return throwError(() => new Error('Failed to create clipboard item'));
      })
    );
  }

  toggleFavorite(id: string, favorite: boolean): Observable<ClipboardItem> {
    return this.http.patch<ClipboardItem>(`${this.apiUrl}/${id}/favorite`, { favorite, userId: this.userId }).pipe(
      catchError((error) => {
        console.error('Error toggling favorite:', error);
        return throwError(() => new Error('Failed to toggle favorite'));
      })
    );
  }

  getFrequent(): Observable<ClipboardItem[]> {
    return this.http.get<ClipboardItem[]>(`${this.apiUrl}/frequent`, {
      params: new HttpParams().set('userId', this.userId),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching frequent items:', error);
        return throwError(() => new Error('Failed to fetch frequent items'));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      params: new HttpParams().set('userId', this.userId),
    }).pipe(
      catchError((error) => {
        console.error('Error deleting clipboard item:', error);
        return throwError(() => new Error('Failed to delete clipboard item'));
      })
    );
  }

  incrementUsage(id: string): Observable<ClipboardItem> {
    return this.http.post<ClipboardItem>(`${this.apiUrl}/${id}/increment`, { userId: this.userId }).pipe(
      catchError((error) => {
        console.error('Error incrementing usage:', error);
        return throwError(() => new Error('Failed to increment usage'));
      })
    );
  }

  updateSettings(settings: { activeTab?: string; itemOrder?: string[]; isTextHidden?: Record<string, boolean> }): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/settings/${this.userId}`, settings).pipe(
      catchError((error) => {
        console.error('Error updating settings:', error);
        return throwError(() => new Error('Failed to update settings'));
      })
    );
  }

  getSettings(): Observable<{ activeTab: string; itemOrder: string[]; isTextHidden: Record<string, boolean> }> {
    return this.http.get<{ activeTab: string; itemOrder: string[]; isTextHidden: Record<string, boolean> }>(
      `${this.apiUrl}/settings/${this.userId}`
    ).pipe(
      catchError((error) => {
        console.error('Error fetching settings:', error);
        return throwError(() => new Error('Failed to fetch settings'));
      })
    );
  }
}