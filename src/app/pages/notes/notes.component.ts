import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../core/notes.service';
import { Note } from '../../core/models/note';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  activeTab: 'all' | 'favorites' = 'all';
  newNoteTitle: string = '';
  newNoteContent: string = '';

  constructor(
    private notesService: NotesService,
    private alerts: TuiAlertService
  ) {}

  ngOnInit() {
    this.loadNotes();
    this.loadDraft();
  }

  loadNotes() {
    this.notesService.getAll().subscribe({
      next: (notes) => {
        this.notes = this.activeTab === 'favorites' ? notes.filter((note) => note.favorite) : notes;
      },
      error: () => {
        this.alerts.open('Ошибка загрузки заметок').subscribe();
      },
    });
  }

  setTab(tab: 'all' | 'favorites') {
    this.activeTab = tab;
    this.loadNotes();
  }

  toggleFavorite(note: Note) {
    this.notesService.toggleFavorite(note.id, !note.favorite).subscribe({
      next: (updated) => {
        this.notes = this.notes.map((n) => (n.id === updated.id ? updated : n));
      },
      error: () => {
        this.alerts.open('Ошибка изменения избранного').subscribe();
      },
    });
  }

  loadDraft() {
    const savedDraft = localStorage.getItem('note_create_draft');
    if (savedDraft) {
      const { title, content } = JSON.parse(savedDraft);
      this.newNoteTitle = title || '';
      this.newNoteContent = content || '';
    }
  }

  saveDraft() {
    localStorage.setItem(
      'note_create_draft',
      JSON.stringify({ title: this.newNoteTitle, content: this.newNoteContent })
    );
  }

  createNote() {
    if (this.newNoteTitle && this.newNoteContent) {
      const content = this.newNoteContent.replace(/<br\s*\/?>/gi, '\n');
      this.notesService.create(this.newNoteTitle, content).subscribe({
        next: (note) => {
          this.notes.push(note);
          this.newNoteTitle = '';
          this.newNoteContent = '';
          localStorage.removeItem('note_create_draft');
          this.alerts.open('Заметка создана!').subscribe();
        },
        error: () => {
          this.alerts.open('Ошибка создания заметки').subscribe();
        },
      });
    } else {
      this.alerts.open('Заполните заголовок и содержимое').subscribe();
    }
  }

  updateNote(note: Note) {
    this.notesService.update(note.id, note.title, note.content).subscribe({
      next: (updated) => {
        this.notes = this.notes.map((n) => (n.id === updated.id ? updated : n));
        this.alerts.open('Заметка обновлена!').subscribe();
      },
      error: () => {
        this.alerts.open('Ошибка обновления заметки').subscribe();
      },
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.createNote();
    }
  }

  deleteNote(note: Note) {
    this.notesService.delete(note.id).subscribe({
      next: () => {
        this.notes = this.notes.filter((n) => n.id !== note.id);
        this.alerts.open('Заметка удалена!').subscribe();
      },
      error: () => {
        this.alerts.open('Ошибка удаления заметки').subscribe();
      },
    });
  }
}