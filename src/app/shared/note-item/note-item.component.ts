import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from '../../core/models/note';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.scss'],
})
export class NoteItemComponent implements AfterViewInit {
  @Input() note!: Note;
  @Output() toggleFavorite = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();
  @ViewChild('content') contentRef!: ElementRef<HTMLParagraphElement>;
  isExpanded = false;
  isOverflowing = false;

  ngAfterViewInit() {
    // Проверяем, превышает ли содержимое 90px
    this.checkOverflow();
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
}