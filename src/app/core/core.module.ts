import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardService } from './clipboard.service';
import { NotesService } from './notes.service';
import { StorageService } from './storage.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [ClipboardService, NotesService, StorageService],
})
export class CoreModule {}