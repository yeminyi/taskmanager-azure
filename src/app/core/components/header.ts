import {ChangeDetectionStrategy, Component, EventEmitter, Output, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" fxFlex="1 1 auto">
      <button mat-icon-button (click)="onClick()" *ngIf="auth">
        <mat-icon>menu</mat-icon>
      </button>
      <span>{{'projectname' | translate}}</span>
      <span class="fill-remaining-space"></span>
      <theme-picker (themeChange)="themeChange($event)"></theme-picker>
      <button mat-button [matMenuTriggerFor]="menu" [matTooltip]="tooltip"> <mat-icon>language</mat-icon>{{'language' | translate}}</button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="useChinese()">中文</button>
        <button mat-menu-item (click)="useEnglish()">English</button>
      </mat-menu>
      <span><a mat-button *ngIf="auth" (click)="handleLogout()">{{'signout' | translate}}</a></span>
    </mat-toolbar>
  `,
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private translate: TranslateService){
    translate.addLangs(['cn', 'en']);	// Add
    translate.setDefaultLang('en');		// Set default
    translate.use('en');				// use the language
  }
  @Input() auth = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<boolean>();
  @Output() changeTheme = new EventEmitter<string>();
  @Output() logout = new EventEmitter();
  tooltip: string;
  onClick() {
    this.toggle.emit();
  }

  handleLogout() {
    this.logout.emit();
  }
  ngDoCheck(){
    this.tooltip = this.translate.instant('head.tooltip');
  }
  onChange(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }
  themeChange(theme: string)
  {
    console.log('head');
    this.changeTheme.emit(theme);
  }
  useEnglish() {
    this.translate.use('en');
  }

  useChinese() {
    this.translate.use('cn');
  }
}
