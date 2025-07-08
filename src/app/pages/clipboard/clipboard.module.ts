import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardComponent } from './clipboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ClipboardComponent],
  imports: [CommonModule, SharedModule],
  exports: [ClipboardComponent],
})
export class ClipboardModule {}