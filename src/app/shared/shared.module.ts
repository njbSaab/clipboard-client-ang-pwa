import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardItemComponent } from './clipboard-item/clipboard-item.component';
import { NoteItemComponent } from './note-item/note-item.component';
import { TuiTabsModule, TuiTilesModule } from '@taiga-ui/kit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiSvgModule } from '@taiga-ui/core';

@NgModule({
  declarations: [ClipboardItemComponent, NoteItemComponent],
  imports: [
    CommonModule,
    TuiTabsModule, 
    BrowserAnimationsModule,
    TuiTilesModule,
    TuiSvgModule,
  ],
  exports: [ClipboardItemComponent, NoteItemComponent, TuiTabsModule, TuiTilesModule, TuiSvgModule],
})
export class SharedModule {}