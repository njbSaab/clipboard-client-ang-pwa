import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardComponent } from './clipboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ClipboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule // Импортируем DragDropModule вместо DndModule
  ],
  exports: [ClipboardComponent]
})
export class ClipboardModule {}