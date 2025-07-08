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
}

@Injectable()
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<ClipboardDB>>;

  constructor() {
    this.dbPromise = openDB<ClipboardDB>('clipboard-app', 1, {
      upgrade(db) {
        db.createObjectStore('clipboard', { keyPath: 'id' });
        db.createObjectStore('notes', { keyPath: 'id' });
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

  // Новый метод для удаления записи буфера обмена
  async deleteClipboardItem(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('clipboard', id);
  }

  // Новый метод для удаления заметки
  async deleteNote(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('notes', id);
  }
}