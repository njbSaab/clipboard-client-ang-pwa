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
  newNoteTitle = '';
  newNoteContent = '';

  constructor(
    private notesService: NotesService,
    private alerts: TuiAlertService
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.notesService.getAll().subscribe((notes) => {
      this.notes =
        this.activeTab === 'favorites' ? notes.filter((note) => note.favorite) : notes;
    });
  }

  setTab(tab: 'all' | 'favorites') {
    this.activeTab = tab;
    this.loadNotes();
  }

  toggleFavorite(note: Note) {
    this.notesService.toggleFavorite(note.id, !note.favorite).subscribe((updated) => {
      this.notes = this.notes.map((n) => (n.id === updated.id ? updated : n));
    });
  }

  createNote() {
    if (this.newNoteTitle && this.newNoteContent) {
      const content = this.newNoteContent.replace(/<br\s*\/?>/gi, '\n');
      this.notesService
        .create(this.newNoteTitle, content)
        .subscribe((note) => {
          this.notes.push(note);
          this.newNoteTitle = '';
          this.newNoteContent = '';
          this.alerts.open('Заметка создана!').subscribe();
        });
    } else {
      this.alerts.open('Заполните заголовок и содержимое').subscribe();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.createNote();
    }
  }

  deleteNote(note: Note) {
    this.notesService.delete(note.id).subscribe(() => {
      this.notes = this.notes.filter((n) => n.id !== note.id);
      this.alerts.open('Заметка удалена!').subscribe();
    });
  }
}