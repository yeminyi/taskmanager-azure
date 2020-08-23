import { Component, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-quick-task',
  template: `
    <mat-form-field class="full-width" [matTooltip]="quickTooltip">
      <input matInput placeholder="{{'task.quicktask' | translate}}" [(ngModel)]="desc"/>
      <button mat-icon-button matSuffix (click)="sendQuickTask()">
        <mat-icon>send</mat-icon>
      </button>
    </mat-form-field>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickTaskComponent {

  desc: string;
  quickTooltip: string;
  @Output() quickTask = new EventEmitter<string>();

  constructor(private translate:TranslateService) { }

  ngDoCheck(){
    this.quickTooltip = this.translate.instant('task.quicktooltip');
  }

  @HostListener('keyup.enter')
  sendQuickTask() {
    if (!this.desc || this.desc.length === 0 || !this.desc.trim() || this.desc.length > 20) {
      return;
    }
    this.quickTask.emit(this.desc);
    this.desc = '';
  }
}
