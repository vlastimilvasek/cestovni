import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { LOGO_200x100 } from '../assets/params/loga';

// Data and Service
import { ISrovnani } from './_interfaces/odpovednost';
import { ParamsService } from './_services/params.service';
import { SrovnaniComponent } from './srovnani/srovnani.component';
import { TabsetComponent, PopoverModule } from 'ngx-bootstrap';

@Component({
    selector: 'app-main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ ParamsService ]
})
export class AppComponent implements OnInit {
    lists = {};
    LOGA = LOGO_200x100;
    URL = { 'adresa' : '' };
    data: any;
    srovnani: ISrovnani;
    translate: TranslateService;
    offers = [];
    nvoffers = [];
    filters;
    layouthelper = 'none';
    layout = {
        grid: {
            'z_label' : 'col-sm-5 col-md-4 offset-md-1 col-lg-2 offset-lg-3',
            'z_input' : 'col-sm-7 col-md-6 col-lg-4',
            'z_offset' : 'offset-sm-5',
            'column3' : 'col-12 col-md-4',
            'label3' : 'col-5 col-md-12',
            'input3' : 'col-7 col-md-12',
            'offset3' : 'offset-5 offset-md-0',
            'label4' : 'col-12',
            'input4' : 'col-8 col-md-10',
            'add4' : 'col-4 col-md-2',
            'offset4' : 'col',
            'column' : 'col-lg-6',
            'label' : 'col-sm-5',
            'input' : 'col-sm-7',
            'offset' : 'offset-sm-5',
            'column2_1' : 'col-lg-4',
            'column2_2' : 'col-lg-8',
            'label2_1' : 'col-lg-7 col-md-8 col-9',
            'input2_1' : 'col-lg-5 col-md-4 col-3',
            'label2' : 'col-lg-8 col-sm-5',
            'input2' : 'col-lg-4 col-sm-7',
        },
        table: true,
        kontakt_text: '',
        fixace: {1 : 'rok', 3 : 'roky', 5 : 'let' }
    };
    kalk_aktivni = false;
    mail_odeslan = false;
    filtrCollapsed = true;
    prvniPomoc = true;
    @ViewChild('f') zadani_form: any;
    @ViewChild('filtry') filtr_form: any;
    @ViewChild('kalk_email') email_form: any;
    @ViewChild(SrovnaniComponent) srovnaniCmp: SrovnaniComponent;
    @ViewChild('filtrHint') filtrHint: any;
    @ViewChild('debugModal') debug_modal: any;
    @ViewChild('layoutHelper') layout_helper: any;
    @ViewChild('stepTabs') staticTabs: TabsetComponent;

    version = '1.0.2';
    aversion = require('../../package.json').version;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // console.log(event.charCode);
        if (event.charCode === 272 || event.charCode === 240) { this.debug_modal.show(); }
        if (event.charCode === 248 || event.charCode === 321) { this.layouthelper = this.layouthelper === 'none' ? '' : 'none'; }
    }

    constructor(private scroll: ScrollToService, translate: TranslateService,
        private paramsService: ParamsService, private route: ActivatedRoute) {
        this.translate = translate;
        this.translate.addLangs(['cs', 'en']);
        this.translate.setDefaultLang('en');
        const lang = this.route.snapshot.queryParams['lang']  || 'cs';
        this.translate.use(lang);
    }

    KalkulaceEmail(form: any): void {
        if (form.valid) {
            this.GAEvent('CEST', 'Kalkulace', 'Zaslání na email', 1);
            if (this.data.id !== '' ) {
                this.data.link = this.URL.adresa;
                this.paramsService.KalkulaceEmail( this.data )
                .subscribe( resp => {
                    // console.log('poslat na email resp ', resp);
                    if (resp) {
                        this.mail_odeslan = true;
                    }
                });
            }
        }
    }

    GAEvent(cat: string, label: string, action: string, val: number): void {
        (<any>window).ga('send', 'event', {
            eventCategory: cat,
            eventLabel: label,
            eventAction: action,
            eventValue: val
        });
    }

    submitForm(form: any): void {
        if (form.valid) {
            this.kalkuluj();
            this.staticTabs.tabs[1].active = true;
        }
    }

    tabSrovnani(): void {
        // console.log('layout.kontakt_text: ', this.layout.kontakt_text);
        this.layout.kontakt_text = '';
        if (!this.offers.length && !this.kalk_aktivni && this.zadani_form.valid) {
            this.kalkuluj();
        }
    }

    kalkuluj(): void {
        this.kalk_aktivni = true;
        this.filtrCollapsed = true;
        this.offers = [];
        this.nvoffers = [];
        this.paramsService.getSrovnani(this.data)
        .subscribe( srovnani => {
            this.srovnani = srovnani;
            // console.log('původní filtry ', this.filters.partnobj );
            let items = [];
            const partneri = [];
            const partnobj = {};
            const partnobj_old = this.filters.partnobj || {};  // uchování nastavení při pře-kalkulaci
            this.data.id = srovnani.id;
            this.URL.adresa = window.location.origin + window.location.pathname + '/?id=' + srovnani.id;

            srovnani.items.forEach( (x) => {
                if ( partneri.indexOf(x.pojistovna) === -1 ) {
                    partneri.push( x.pojistovna );
                    partnobj[x.pojistovna] = (partnobj_old[x.pojistovna] !== undefined) ? partnobj_old[x.pojistovna] : true;
                    // console.log('partner-  filtry ', x.pojistovna + ' - ' + partnobj_old[x.pojistovna] );
                }
                items.push( Object.assign({}, x) );
            });
            this.filters.partneri = partneri;
            // this.filters.partnobj = JSON.parse(`{"` + partneri.join(`":true,"`) + `":true}`); // při pře-kalkulaci vše vybráno
            this.filters.partnobj = partnobj;

            items = items.filter(x => (x.kalkulace === 1 && x.platby[1] > 0) );
            items.sort(function(a, b) { return a.platby[1] - b.platby[1]; });

            this.offers = this.nvoffers = items;

            this.kalk_aktivni = false;

            // console.log('filtry se zachovaným nastavením ', partnobj );
            this.filtruj_nabidky();
            if (this.prvniPomoc) { this.filtrHint.show(); }
            setTimeout(() =>  { this.prvniPomoc = false;  }, 8000);
            this.GAEvent('CEST', 'Kalkulace', 'Kalkulace', 1);

        });
    }

    filtruj_nabidky(): void {
        // console.log('this.filters.partnobj : ', this.filters.partnobj);
        this.offers = this.nvoffers.filter( x => this.filters.partnobj[x.pojistovna] > 0);
        if (this.data.pojisteni === 'CEST') {
            if (this.filters.min_urtn) { this.offers = this.offers.filter( x => Number(x.params.urtn.hodnota) > 0 ); }
            if (this.filters.min_zavl) { this.offers = this.offers.filter( x => Number(x.params.zavl.hodnota) > 0 ); }
            if (this.filters.min_odpz) { this.offers = this.offers.filter( x => Number(x.params.odpz.hodnota) > 0 ); }
        }
        // console.log('offers po filtrech : ', this.offers);
        // function sortp(c) { return function(a, b) { return a.platby[c] - b.platby[c]; }; }
        // this.offers.sort(sortp(this.data.platba));
        // this.offers.sort(function(a, b) { return a.ordering - b.ordering; });
    }

    initData(data: any): void {
        this.data = data || {
            id: '',
            pojisteni: this.route.snapshot.queryParams['pojisteni'] || 'CEST',
            zeme: this.route.snapshot.queryParams['zeme'] || 'EVR',
            termin: this.route.snapshot.queryParams['termin'] || [],
            typ: this.route.snapshot.queryParams['typ'] || 'tur',
            sporty: this.route.snapshot.queryParams['sporty'] || 0,
            rodina: this.route.snapshot.queryParams['rodina'] || false,
            pocet_osob: this.route.snapshot.queryParams['pocet_osob'] || 1,
            pocet_dnu: null,
            osoby: [{}],
            storno: this.route.snapshot.queryParams['storno'] || false,
            storno_cena: this.route.snapshot.queryParams['storno_cena'] || '',
            poznamka: this.route.snapshot.queryParams['poznamka'] || '',
            promo_kod: this.route.snapshot.queryParams['promo_kod'] || '',
            ziskatel: this.route.snapshot.queryParams['ziskatel'] || 'srovnavac.cz',
            debug: true
        };
        this.zadani_form.submitted = false;
    }

    ngOnInit() {
        this.filtr_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            // console.log( 'zmena filtrů : ', JSON.stringify(this.filters) );
            this.filtruj_nabidky();
            this.GAEvent('CEST', 'Kalkulace', 'Filtrování nabídek', 1);
        });

        console.log( 'verze: ', this.version + '@' + this.aversion );

        this.zadani_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            this.zadani_form.submitted = false;
            // sessionStorage.setItem('zadani_form', JSON.stringify(form));
        });

        this.email_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            this.email_form.submitted = false;
        });

        this.filters = {
            min_zavl: false,
            min_urtn: false,
            min_odpz: false
        };
        this.srovnani = {
            id: '',
            items: [],
            time: ''
        };
        let input_data = null;
        if (this.route.snapshot.queryParams['id'] !== undefined ) {
            this.paramsService.getKalkulace( this.route.snapshot.queryParams['id'] )
            .subscribe( data => {
                // console.log('data ', data);
                try {
                    input_data = data;
                    if (input_data.termin && input_data.termin.length > 1) {
                        const termin =  [ new Date(input_data.termin[0]), new Date(input_data.termin[1]) ];
                        input_data.termin = termin;
                    }
                    if (input_data.osoby && input_data.osoby.length > 0) {
                        const osoby = input_data.osoby;
                        input_data.osoby = [];
                        for (const os of osoby) {
                            if (os.vek) {
                                input_data.osoby.push(os);
                            }
                        }
                        input_data.pocet_osob = input_data.osoby.length;
                    }
                } catch (e) {
                    // console.log(e);
                }
                this.initData(input_data);
                setTimeout(() =>  {
                    // console.log('zadani_form form valid', this.zadani_form.form.valid );
                    if (this.zadani_form.valid) {
                        this.kalkuluj();
                        this.staticTabs.tabs[1].active = true;
                    }
                }, 50);
            });
        } else if (this.route.snapshot.queryParams['data'] !== undefined ) {
            // console.log('data snapshot', this.route.snapshot.queryParams['data'] );
            try {
                input_data = JSON.parse(this.route.snapshot.queryParams['data']);
                if (input_data.termin && input_data.termin.length > 1) {
                    const termin =  [ new Date(input_data.termin[0]), new Date(input_data.termin[1]) ];
                    input_data.termin = termin;
                }
                if (input_data.osoby && input_data.osoby.length > 0) {
                    const osoby = input_data.osoby;
                    input_data.osoby = [];
                    for (const os of osoby) {
                        if (os.vek) {
                            input_data.osoby.push(os);
                        }
                    }
                    input_data.pocet_osob = input_data.osoby.length;
                }
            } catch (e) {
                // console.log(e);
            }
        }
        // console.log('input_data ', input_data);
        this.initData(input_data);
        this.data.ziskatel = window['ziskatel'];
        // console.log('data ', JSON.parse(this.route.snapshot.queryParams['data']));
        // console.log('this.data ', this.data);
    }
}
