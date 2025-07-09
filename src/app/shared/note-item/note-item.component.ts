import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Note } from '../../core/models/note';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.scss'],
})
export class NoteItemComponent implements AfterViewInit {
  @Input() note!: Note;
  @Output() toggleFavorite = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();
  @Output() edit = new EventEmitter<Note>();
  @ViewChild('content') contentRef!: ElementRef<HTMLParagraphElement>;
  isExpanded = false;
  isOverflowing = false;
  isEditing = false;
  editTitle: string = '';
  editContent: string = '';

  constructor(
    @Inject(TuiAlertService) private alerts: TuiAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.checkOverflow();
    this.cdr.detectChanges(); // Явно запускаем проверку изменений после проверки переполнения
  }

  checkOverflow() {
    if (this.contentRef) {
      const element = this.contentRef.nativeElement;
      this.isOverflowing = element.scrollHeight > 90;
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.note);
  }

  onDelete() {
    this.delete.emit(this.note);
  }

  onEdit() {
    this.isEditing = true;
    this.editTitle = this.note.title;
    this.editContent = this.note.content;
    this.cdr.detectChanges(); // Запускаем проверку изменений после установки isEditing
  }

  saveEdit() {
    if (this.editTitle.trim() && this.editContent.trim()) {
      const updatedNote = { ...this.note, title: this.editTitle, content: this.editContent };
      this.edit.emit(updatedNote);
      this.isEditing = false;
      this.cdr.detectChanges(); // Запускаем проверку изменений после сохранения
    } else {
      this.alerts.open('Заполните заголовок и содержимое').subscribe();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editTitle = '';
    this.editContent = '';
    this.cdr.detectChanges(); // Запускаем проверку изменений после отмены
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }
}