import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { csLocale } from 'ngx-bootstrap/locale';
defineLocale('cs', csLocale);
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { SelectModule } from 'ng-select';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';

import { RootComponent } from './root.component';
import { AppComponent } from './app.component';

import { KeysPipe } from './_pipes/keys.pipe';
import { ProcentoFormatPipe } from './_pipes/procento-format.pipe';
import { TelefonFormatPipe } from './_pipes/telefon-format.pipe';
import { MenaFormatInfoPipe } from './_pipes/mena-format-info.pipe';
import { MenaFormatPipe } from './_pipes/mena-format.pipe';
import { StarPipe } from './_pipes/star.pipe';
import { TipsPipe } from './_pipes/tips.pipe';

import { RCValidator } from './_directives/RC.validator';
import { ICValidator } from './_directives/IC.validator';
import { TextNumberMinValidator, TextNumberMaxValidator } from './_directives/textnumber.validator';
import { TelefonFormatterDirective } from './_directives/telefon.formatter';

import { routing, mainRoutingProviders } from './app.router';
import { ZadaniComponent } from './zadani/zadani.component';
import { SrovnaniComponent } from './srovnani/srovnani.component';
import { FiltryComponent } from './filtry/filtry.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/');
}

const CustomSelectOptions: INgxSelectOptions = {
    optionValueField: 'value',
    optionTextField: 'label',
    keepSelectedItems: false
};

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    KeysPipe,
    RCValidator,
    ICValidator,
    TextNumberMinValidator,
    TextNumberMaxValidator,
    TelefonFormatPipe,
    TelefonFormatterDirective,
    ZadaniComponent,
    SrovnaniComponent,
	MenaFormatPipe,
	MenaFormatInfoPipe,
    ProcentoFormatPipe,
	StarPipe,
    TipsPipe,	
    FiltryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),
    HttpClientModule,
    mainRoutingProviders,
    routing,
    ScrollToModule.forRoot(),
    BrowserAnimationsModule,
    NgxSelectModule.forRoot(CustomSelectOptions),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  providers: [TelefonFormatPipe],
  bootstrap: [RootComponent]
})
export class AppModule { }
