import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  NgModule,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {StyleManager} from '../style-manager/style-manager';
import {ThemeStorage, DocsSiteTheme} from './theme-storage/theme-storage';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {map, filter} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'theme-picker',
  templateUrl: 'theme-picker.html',
  styleUrls: ['theme-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {'aria-hidden': 'true'},
})
export class ThemePicker implements OnInit, OnDestroy {
  private _queryParamSubscription = Subscription.EMPTY;
  currentTheme: DocsSiteTheme;
  pickerTooltip: string;
  themes: DocsSiteTheme[] = [
    {
      primary: '#009688',
      accent: '#FFC107',
      name: 'green-blue',
      isDark: false,
      isDefault: true,
    },
    {
      primary: '#607d8b',
      accent: '#4CAF50',
      name: 'grey-amber',
      isDark: true,
    },
    {
      primary: '#673AB7',
      accent: '#FFC107',
      name: 'deeppurple-amber',
      isDark: false,
    },
    {
      primary: '#9C27B0',
      accent: '#4CAF50',
      name: 'purple-green',
      isDark: true,
    },
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      name: 'indigo-pink',
      isDark: false,
    },
    {
      primary: '#E91E63',
      accent: '#607D8B',
      name: 'pink-bluegrey',
      isDark: true,
    },
  ];

  constructor(
    public styleManager: StyleManager,
    private _themeStorage: ThemeStorage,
    private _activatedRoute: ActivatedRoute,
    private translate: TranslateService) {
    this.installTheme(this._themeStorage.getStoredThemeName());
  }

  ngOnInit() {
    this._queryParamSubscription = this._activatedRoute.queryParamMap
      .pipe(map(params => params.get('theme')), filter(Boolean))
      .subscribe(themeName => this.installTheme(themeName));
  }
  ngDoCheck(){
    this.pickerTooltip = this.translate.instant('themepicker.tooltip');
  }
  ngOnDestroy() {
    this._queryParamSubscription.unsubscribe();
  }

  installTheme(themeName: any) {
    const theme = this.themes.find(currentTheme => currentTheme.name === themeName);

    if (!theme) {
      return;
    }

    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', `assets/${theme.name}.css`);
    }

    if (this.currentTheme) {
      this._themeStorage.storeTheme(this.currentTheme);
    }
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule,
    CommonModule
  ],
  exports: [ThemePicker],
  declarations: [ThemePicker],
  providers: [StyleManager, ThemeStorage],
})
export class ThemePickerModule { }
