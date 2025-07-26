import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ClipboardItem } from './models/clipboard-item';
import { Note } from './models/note';

interface ClipboardDB extends DBSchema {
  clipboard: {
    key: string;
    value: ClipboardItem;
  };
  notes: {
    key: string;
    value: Note;
  };
  noteDraft: {
    key: string;
    value: { title: string; content: string };
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<ClipboardDB>>;

  constructor() {
    this.dbPromise = openDB<ClipboardDB>('clipboard-app', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('clipboard', { keyPath: 'id' });
          db.createObjectStore('notes', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('noteDraft', { keyPath: 'id' });
        }
      },
    });
  }

  async addClipboardItem(item: ClipboardItem): Promise<void> {
    const db = await this.dbPromise;
    await db.put('clipboard', item);
  }

  async getClipboardItems(): Promise<ClipboardItem[]> {
    const db = await this.dbPromise;
    return db.getAll('clipboard');
  }

  async addNote(note: Note): Promise<void> {
    const db = await this.dbPromise;
    await db.put('notes', note);
  }

  async getNotes(): Promise<Note[]> {
    const db = await this.dbPromise;
    return db.getAll('notes');
  }

  async deleteClipboardItem(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('clipboard', id);
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('notes', id);
  }

  async saveNoteDraft(title: string, content: string): Promise<void> {
    const db = await this.dbPromise;
    await db.put('noteDraft', { title, content }, 'draft');
  }

  async getNoteDraft(): Promise<{ title: string; content: string } | undefined> {
    const db = await this.dbPromise;
    return db.get('noteDraft', 'draft');
  }

  async clearNoteDraft(): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('noteDraft', 'draft');
  }
}