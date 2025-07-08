import { Component, Inject} from '@angular/core';
import {TuiAlertService} from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  activeItemIndex = 0;
 
  constructor(
      @Inject(TuiAlertService)
      private readonly alerts: TuiAlertService,
  ) {}

  onClick(item: string): void {
      this.alerts.open(item).subscribe();
  }
}