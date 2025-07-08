import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesComponent } from './notes.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [NotesComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [NotesComponent],
})
export class NotesModule {}