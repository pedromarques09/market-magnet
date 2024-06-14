import { Component, NgModule, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { Subscription } from 'rxjs';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit, OnDestroy {
  @Input()
  menuItems: any;

  @Input()
  menuMode!: string;

  @Input()
  user!: any | null;

  userName!: any;
  private userNameSubscription!: Subscription;
  constructor(private userStateService: UserStateService) {}

  async ngOnInit() {
    this.userNameSubscription =
      this.userStateService.currentUserName$.subscribe((name) => {
        this.userName = name;
      });
  }

  ngOnDestroy(): void {
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
  }
}

@NgModule({
  imports: [DxListModule, DxContextMenuModule, CommonModule],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent],
})
export class UserPanelModule {}
