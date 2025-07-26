import { Component, OnInit } from '@angular/core';
import { ClipboardService } from '../../core/clipboard.service';
import { ClipboardItem } from '../../core/models/clipboard-item';
import { TuiAlertService } from '@taiga-ui/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss'],
})
export class ClipboardComponent implements OnInit {
  items: ClipboardItem[] = [];
  activeTab: 'all' | 'favorites' | 'frequent' = 'all';
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private clipboardService: ClipboardService,
    private alerts: TuiAlertService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((search) => {
      this.loadSettingsAndItems(search);
    });
  }

  ngOnInit() {
    this.loadSettingsAndItems();
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  private loadSettingsAndItems(search: string = '') {
    this.clipboardService.getSettings().subscribe({
      next: (settings) => {
        this.activeTab = settings.activeTab as 'all' | 'favorites' | 'frequent';
        this.loadItems(settings.itemOrder, settings.isTextHidden, search);
      },
      error: () => {
        this.alerts.open('Ошибка загрузки настроек').subscribe();
        this.loadItems([], {}, search);
      },
    });
  }

  private loadItems(order: string[], hiddenStates: Record<string, boolean>, search: string) {
    if (this.activeTab === 'frequent') {
      this.clipboardService.getFrequent().subscribe({
        next: (items) => {
          this.items = this.sortItemsByOrder(items, order).map(item => ({
            ...item,
            favorite: !!item.favorite, // Конвертируем 0/1 в boolean
            isTextHidden: hiddenStates[item.id] ?? false,
          }));
        },
        error: () => {
          this.items = [];
          this.alerts.open('Ошибка загрузки элементов').subscribe();
        },
      });
    } else {
      this.clipboardService.getAll(search).subscribe({
        next: (items) => {
          this.items = (this.activeTab === 'favorites' ? items.filter((item) => item.favorite) : items)
            .map(item => ({
              ...item,
              favorite: !!item.favorite, // Конвертируем 0/1 в boolean
              isTextHidden: hiddenStates[item.id] ?? false,
            }))
            .sort((a, b) => {
              const aIndex = order.indexOf(a.id);
              const bIndex = order.indexOf(b.id);
              return (aIndex === -1 ? items.length : aIndex) - (bIndex === -1 ? items.length : bIndex);
            });
        },
        error: () => {
          this.items = [];
          this.alerts.open('Ошибка загрузки элементов').subscribe();
        },
      });
    }
  }

  setTab(tab: 'all' | 'favorites' | 'frequent') {
    this.activeTab = tab;
    this.clipboardService.updateSettings({ activeTab: tab }).subscribe({
      next: () => this.loadSettingsAndItems(this.searchQuery),
      error: () => this.alerts.open('Ошибка сохранения вкладки').subscribe(),
    });
  }

  toggleFavorite(item: ClipboardItem) {
    this.clipboardService.toggleFavorite(item.id, !item.favorite).subscribe({
      next: (updated) => {
        this.items = this.items.map((i) => (i.id === updated.id ? { ...updated, favorite: !!updated.favorite, isTextHidden: i.isTextHidden } : i));
      },
      error: () => {
        this.alerts.open('Ошибка изменения избранного').subscribe();
      },
    });
  }

  copyText(item: ClipboardItem) {
    navigator.clipboard.writeText(item.content).then(() => {
      this.clipboardService.incrementUsage(item.id).subscribe({
        next: (updated) => {
          this.items = this.items.map((i) => (i.id === updated.id ? { ...updated, favorite: !!updated.favorite, isTextHidden: i.isTextHidden } : i));
          this.alerts.open('Текст скопирован!').subscribe();
        },
        error: () => {
          this.alerts.open('Ошибка при обновлении счётчика использования').subscribe();
        },
      });
    }).catch(() => {
      this.alerts.open('Ошибка копирования текста').subscribe();
    });
  }

  hideText(item: ClipboardItem & { source?: string }) {
    if (item.source === 'button') {
      this.toggleHideText(item);
    } else {
      const originalHiddenState = this.items.find(i => i.id === item.id)?.isTextHidden ?? false;
      this.items = this.items.map((i) =>
        i.id === item.id ? { ...i, isTextHidden: true } : i
      );
      setTimeout(() => {
        this.items = this.items.map((i) =>
          i.id === item.id ? { ...i, isTextHidden: originalHiddenState } : i
        );
      }, 500);
    }
  }

  toggleHideText(item: ClipboardItem) {
    const newHiddenState = !this.items.find(i => i.id === item.id)?.isTextHidden;
    this.items = this.items.map((i) =>
      i.id === item.id ? { ...i, isTextHidden: newHiddenState } : i
    );
    this.clipboardService.updateSettings({
      isTextHidden: { [item.id]: newHiddenState },
    }).subscribe({
      error: () => this.alerts.open('Ошибка сохранения состояния скрытия').subscribe(),
    });
  }

  deleteItem(item: ClipboardItem) {
    this.clipboardService.delete(item.id).subscribe({
      next: () => {
        this.items = this.items.filter((i) => i.id !== item.id);
        this.clipboardService.updateSettings({
          itemOrder: this.items.map(i => i.id),
        }).subscribe({
          error: () => this.alerts.open('Ошибка обновления порядка после удаления').subscribe(),
        });
        this.alerts.open('Элемент удалён!').subscribe();
      },
      error: () => {
        this.alerts.open('Ошибка удаления элемента').subscribe();
      },
    });
  }

  onDrop(event: CdkDragDrop<ClipboardItem[]>) {
    const newItems = [...this.items];
    moveItemInArray(newItems, event.previousIndex, event.currentIndex);
    this.items = newItems;
    this.clipboardService.updateSettings({
      itemOrder: this.items.map(i => i.id),
    }).subscribe({
      error: () => this.alerts.open('Ошибка сохранения порядка').subscribe(),
    });

    setTimeout(() => {
      const element = document.querySelector(`[data-id="${newItems[event.currentIndex].id}"]`);
      if (element) {
        element.classList.add('cdk-drop');
        setTimeout(() => element.classList.remove('cdk-drop'), 500);
      }
    }, 0);
  }

  private sortItemsByOrder(items: ClipboardItem[], order: string[]): ClipboardItem[] {
    return items.sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);
      return (aIndex === -1 ? items.length : aIndex) - (bIndex === -1 ? items.length : bIndex);
    });
  }

  trackById(index: number, item: ClipboardItem): string {
    return item.id;
  }
}