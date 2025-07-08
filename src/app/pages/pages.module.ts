import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from './clipboard/clipboard.module';
import { NotesModule } from './notes/notes.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClipboardModule,
    NotesModule,
    SharedModule,
  ],
})
export class PagesModule {}