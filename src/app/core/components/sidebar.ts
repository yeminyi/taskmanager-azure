import {ChangeDetectionStrategy, Component, EventEmitter, Output, Input} from '@angular/core';
import {getDate} from 'date-fns';
import {Project} from '../../domain';

@Component({
  selector: 'app-sidebar',
  template: `
    <div *ngIf="auth">
      <mat-nav-list>
        <h3 matSubheader>{{'project' | translate}}</h3>
        <mat-list-item [routerLink]="['/projects']" (click)="handleClicked($event)">
          <mat-icon matListIcon svgIcon="projects"></mat-icon>
          <span matLine>{{'side.project' | translate}}</span>
          <span matLine matSubheader> {{'side.project_desc' | translate}} </span>
        </mat-list-item>
        <mat-list-item *ngFor="let prj of projects" (click)="onPrjClicked($event, prj)">
          <mat-icon matListIcon svgIcon="project"></mat-icon>
          <a matLine>
            {{ prj.name }}
          </a>
          <span matLine matSubheader> {{ prj.desc }} </span>
        </mat-list-item>
        <mat-divider></mat-divider>
        <h3 matSubheader>{{'side.calendar' | translate}}</h3>
        <mat-list-item [routerLink]="['/mycal/month']" (click)="handleClicked($event)">
          <mat-icon matListIcon svgIcon="month"></mat-icon>
          <span matLine>{{'side.monthly' | translate}}</span>
          <span matLine matSubheader> {{'side.monthly_desc' | translate}} </span>
        </mat-list-item>
        <mat-list-item [routerLink]="['/mycal/week']" (click)="handleClicked($event)">
          <mat-icon matListIcon svgIcon="week"></mat-icon>
          <span matLine> {{'side.weekly' | translate}}</span>
          <span matLine matSubheader> {{'side.weekly_desc' | translate}}</span>
        </mat-list-item>
        <mat-list-item [routerLink]="['/mycal/day']" (click)="handleClicked($event)">
          <mat-icon matListIcon [svgIcon]="today"></mat-icon>
          <span matLine>{{'side.daily' | translate}}</span>
          <span matLine matSubheader> {{'side.daily_desc' | translate}} </span>
        </mat-list-item>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .day-num {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    mat-icon {
      align-self: flex-start;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  @Input() projects: Project[];
  @Input() auth = false;
  @Output() navClicked = new EventEmitter<void>();
  @Output() prjClicked = new EventEmitter<Project>();

  today = 'day';

  constructor() {
    this.today = `day${getDate(new Date())}`;
  }

  handleClicked(ev: Event) {
    ev.preventDefault();
    this.navClicked.emit();
  }

  onPrjClicked(ev: Event, prj: Project) {
    ev.preventDefault();
    this.prjClicked.emit(prj);
  }
}
