import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgModule } from '@angular/core';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { LoginModule } from './login';
import { AppComponent } from './core/containers/app';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ThemePickerModule} from './shared/components/theme-picker';
import {StyleManager} from './shared/components/style-manager';
import {ThemeStorage} from './shared/components/theme-picker/theme-storage/theme-storage';
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'taskmgr' }),
    TransferHttpCacheModule,
    SharedModule,
    LoginModule,
    CoreModule,
    ThemePickerModule,
     // ngx-translate and the loader module
     HttpClientModule,
     TranslateModule.forRoot({
         loader: {
             provide: TranslateLoader,
             useFactory: createTranslateLoader,
             deps: [HttpClient]
         }
     })
  ],
  providers: [
    ThemeStorage,
    StyleManager
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// required for AOT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
