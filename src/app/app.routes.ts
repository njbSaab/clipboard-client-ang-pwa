import { Routes } from '@angular/router';
import { ClipboardComponent } from './pages/clipboard/clipboard.component';
import { NotesComponent } from './pages/notes/notes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clipboard', pathMatch: 'full' },
  { path: 'clipboard', component: ClipboardComponent },
  { path: 'notes', component: NotesComponent },
  { path: '**', redirectTo: 'clipboard' },
];