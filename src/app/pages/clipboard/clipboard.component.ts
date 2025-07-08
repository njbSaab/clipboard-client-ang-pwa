import { Component, OnInit } from '@angular/core';
import { ClipboardService } from '../../core/clipboard.service';
import { ClipboardItem } from '../../core/models/clipboard-item';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss'],
})
export class ClipboardComponent implements OnInit {
  items: ClipboardItem[] = [];
  activeTab: 'all' | 'favorites' | 'frequent' = 'all';

  constructor(private clipboardService: ClipboardService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    if (this.activeTab === 'frequent') {
      this.clipboardService.getFrequent().subscribe((items) => {
        console.log('Frequent items:', items);
        this.items = items;
      });
    } else {
      this.clipboardService.getAll().subscribe((items) => {
        console.log('All items:', items);
        this.items =
          this.activeTab === 'favorites' ? items.filter((item) => item.favorite) : items;
      });
    }
  }

  setTab(tab: 'all' | 'favorites' | 'frequent') {
    this.activeTab = tab;
    this.loadItems();
  }

  toggleFavorite(item: ClipboardItem) {
    this.clipboardService
      .toggleFavorite(item.id, !item.favorite)
      .subscribe((updated) => {
        this.items = this.items.map((i) => (i.id === updated.id ? updated : i));
      });
  }

  copyText(item: ClipboardItem) {
    console.log('Copied:', item.content);
    navigator.clipboard.writeText(item.content)

  }
  hideText(item: ClipboardItem) {
    this.items = this.items.map((i) =>
      i.id === item.id ? { ...i, isTextHidden: item.isTextHidden } : i
    );
    setTimeout(() => {
      this.items = this.items.map((i) =>
        i.id === item.id ? { ...i, isTextHidden: !item.isTextHidden } : i
      );
    }, 500)
  }

  // hideText(item: ClipboardItem) {
  //   this.items = this.items.map((i) =>
  //     i.id === item.id ? { ...i, isTextHidden: true } : i
  //   );
  //   setTimeout(() => {
  //     this.items = this.items.map((i) =>
  //       i.id === item.id ? { ...i, isTextHidden: false } : i
  //     );
  //   }, 300); // 0.3 секунды
  // }

  onDrop(event: DndDropEvent) {
    console.log('Dropped:', event);
    if (event.index !== undefined && event.data) {
      const item = event.data as ClipboardItem;
      const fromIndex = this.items.findIndex((i) => i.id === item.id);
      if (fromIndex !== -1 && fromIndex !== event.index) {
        this.items.splice(fromIndex, 1);
        this.items.splice(event.index, 0, item);
        this.items = [...this.items];
      }
    }
  }

  onDragStart(event: DragEvent, item: ClipboardItem) {
    console.log('Drag started:', item);
  }

  onDragEnd(event: DragEvent, item: ClipboardItem) {
    console.log('Drag ended:', item);
  }
  deleteItem(item: ClipboardItem) {
    this.clipboardService.delete(item.id).subscribe(() => {
      this.items = this.items.filter((i) => i.id !== item.id);
    });
  }

}