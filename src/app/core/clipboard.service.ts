import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ClipboardItem } from './models/clipboard-item';
import { StorageService } from './storage.service';

@Injectable()
export class ClipboardService {
  private apiUrl = 'http://localhost:3000/clipboard';

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private ngZone: NgZone
  ) {
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

  getAll(): Observable<ClipboardItem[]> {
    return this.http.get<ClipboardItem[]>(this.apiUrl).pipe(
      tap((items) => items.forEach((item) => this.storage.addClipboardItem(item))),
      catchError(() => this.storage.getClipboardItems().then((items) => items))
    );
  }

  create(content: string): Observable<ClipboardItem> {
    return this.http.post<ClipboardItem>(this.apiUrl, { content }).pipe(
      tap((item) => this.storage.addClipboardItem(item)),
      catchError(() => {
        const tempItem: ClipboardItem = {
          id: crypto.randomUUID(),
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorite: false,
          usageCount: 0,
        };
        this.storage.addClipboardItem(tempItem);
        return of(tempItem);
      })
    );
  }

  toggleFavorite(id: string, favorite: boolean): Observable<ClipboardItem> {
    return this.http.patch<ClipboardItem>(`${this.apiUrl}/${id}/favorite`, { favorite }).pipe(
      tap((item) => this.storage.addClipboardItem(item))
    );
  }

  getFrequent(): Observable<ClipboardItem[]> {
    return this.http.get<ClipboardItem[]>(`${this.apiUrl}/frequent`).pipe(
      tap((items) => items.forEach((item) => this.storage.addClipboardItem(item))),
      catchError(() => this.storage.getClipboardItems().then((items) => items.filter((item) => item.usageCount > 0)))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.storage.deleteClipboardItem(id)),
      catchError(() => {
        this.storage.deleteClipboardItem(id);
        return of(void 0);
      })
    );
  }
}