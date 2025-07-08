import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClipboardItem } from '../../core/models/clipboard-item';

@Component({
  selector: 'app-clipboard-item',
  templateUrl: './clipboard-item.component.html',
  styleUrls: ['./clipboard-item.component.scss'],
})
export class ClipboardItemComponent {
  @Input() item!: ClipboardItem;
  @Output() toggleFavorite = new EventEmitter<ClipboardItem>();
  @Output() delete = new EventEmitter<ClipboardItem>();
  @Output() copy = new EventEmitter<ClipboardItem>();
  @Output() hideText = new EventEmitter<ClipboardItem>();
  isCopied = false;
  onToggleFavorite() {
    this.toggleFavorite.emit(this.item);
  }
  onDelete() {
    this.delete.emit(this.item);
  }
  onCopy() {
    this.isCopied = true;
    this.copy.emit(this.item);
    setTimeout(() => {
      this.isCopied = false;
    }, 300); // 0.3 секунды
  }
  onToggleHideText() {
    this.hideText.emit(this.item);
  }
  onMouseEnter() {
    this.hideText.emit({ ...this.item, isTextHidden: true });
  }
  onMouseLeave() {
    this.hideText.emit({ ...this.item, isTextHidden: false });
  }
}