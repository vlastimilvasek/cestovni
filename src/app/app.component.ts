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
    providers: [ParamsService]
})
export class AppComponent implements OnInit {
    lists = {};
    LOGA = LOGO_200x100;
    URL = { 'adresa': '' };
    data: any;
    srovnani: ISrovnani;
    translate: TranslateService;
    topped = [];
    offers = [];
    nvoffers = [];
    filters;
    layouthelper = 'none';
    layout = {
        grid: {
            'z_label': 'col-sm-5 col-md-4 offset-md-1 col-lg-2 offset-lg-3',
            'z_input': 'col-sm-7 col-md-6 col-lg-4',
            'z_offset': 'offset-sm-5',
            'column3': 'col-12 col-md-4',
            'label3': 'col-5 col-md-12',
            'input3': 'col-7 col-md-12',
            'offset3': 'offset-5 offset-md-0',
            'label4': 'col-12',
            'input4': 'col-8 col-md-10',
            'add4': 'col-4 col-md-2',
            'offset4': 'col',
            'column': 'col-lg-6',
            'label': 'col-sm-5',
            'input': 'col-sm-7',
            'offset': 'offset-sm-5',
            'column2_1': 'col-lg-4',
            'column2_2': 'col-lg-8',
            'label2_1': 'col-lg-7 col-md-8 col-9',
            'input2_1': 'col-lg-5 col-md-4 col-3',
            'label2': 'col-lg-8 col-sm-5',
            'input2': 'col-lg-4 col-sm-7',
        },
        table: true,
        produktCollapsed: {},
        kontakt_text: '',
        fixace: { 1: 'rok', 3: 'roky', 5: 'let' }
    };
    kalk_aktivni = false;
    mail_odeslan = false;
    filtrCollapsed = true;
    prvniPomoc = false;
    @ViewChild('f', { static: true }) zadani_form: any;
    @ViewChild('filtry', { static: true }) filtr_form: any;
    @ViewChild('kalk_email', { static: true }) email_form: any;
    @ViewChild(SrovnaniComponent, { static: true }) srovnaniCmp: SrovnaniComponent;
    @ViewChild('filtrHint', { static: true }) filtrHint: any;
    @ViewChild('debugModal', { static: true }) debug_modal: any;
    @ViewChild('layoutHelper', { static: true }) layout_helper: any;
    @ViewChild('stepTabs', { static: true }) staticTabs: TabsetComponent;

    version = '1.0.6';
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
        const lang = this.route.snapshot.queryParams['lang'] || 'cs';
        this.translate.use(lang);
    }

    KalkulaceEmail(form: any): void {
        if (form.valid) {
            this.GAEvent('CEST', 'Kalkulace', 'Zaslání na email', 1);
            if (this.data.id !== '') {
                this.data.link = this.URL.adresa;
                this.paramsService.KalkulaceEmail(this.data)
                    .subscribe(resp => {
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

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    kalkuluj(): void {
        this.kalk_aktivni = true;
        this.filtrCollapsed = true;
        this.offers = this.topped = [];
        this.nvoffers = [];
        this.paramsService.getSrovnani(this.data)
            .subscribe(srovnani => {
                this.srovnani = srovnani;
                // console.log('původní filtry ', this.filters.partnobj );
                let items = [];
                const partneri = [];
                const partnobj = {};
                const partnobj_old = this.filters.partnobj || {};  // uchování nastavení při pře-kalkulaci
                this.data.id = srovnani.id;
                this.URL.adresa = window.location.origin + window.location.pathname + '/?id=' + srovnani.id;

                this.kalk_aktivni = false;
                // console.log('APP kalkuluj - srovnani ', this.srovnani);

                srovnani.items.forEach((x) => {
                    if (partneri.indexOf(x.pojistovna) === -1) {
                        partneri.push(x.pojistovna);
                        partnobj[x.pojistovna] = (partnobj_old[x.pojistovna] !== undefined) ? partnobj_old[x.pojistovna] : true;
                    }
                    items.push(Object.assign({}, x));
                    if (Object.keys(this.layout.produktCollapsed).indexOf(x.id) === -1) {
                        this.layout.produktCollapsed[x.id] = true;
                    }

                    // kontrola připojištění - extra
                    const types = ['radio', 'select'];
                    console.log('pocet extras : ', x.extra.length );
                    if (x.extra.length) {
                        const extra = x.extra.filter(e => types.indexOf(e.typ) >= 0);
                        x.extra = [];
                        extra.forEach((e) => {
                            if (Object.keys(e).indexOf('hodnota')) {
                                if (this.IsJsonString(e.hodnota) || (typeof e.hodnota === 'object' && e.hodnota !== null) ) {
                                    if (!(typeof e.hodnota === 'object' && e.hodnota !== null)) {
                                        e.hodnota = JSON.parse(e.hodnota);
                                    }
                                    if (Object.keys(e.hodnota).indexOf('options')) {  // uprava options na pole
                                        const opt = [];
                                        Object.keys(e.hodnota.options).forEach((o) => {
                                            opt.push(e.hodnota.options[o]);
                                        });
                                        e.hodnota.options = opt;
                                    }
                                    x.extra.push(e);
                                } else {
                                    // console.log('chybný objekt extras : ', e.kod);
                                }

                            }
                        });

                        // console.log('APP kalkuluj - extra : ', x.extra);
                    }
                    // nastavení parametrů podle odkazu na extra
                    Object.keys(x.params).forEach(function (key) {
                        if (x.params[key].typ === 'link') {
                            const kod = x.params[key].hodnota.split('.')[1];
                            // console.log('APP kalkuluj - extra kod : ', kod );
                            const extra = x.extra.filter(e => e.kod === kod)[0];
                            // console.log('APP kalkuluj - extra : ', extra );
                            if (typeof extra === 'object' && extra !== null) {
                                // jedno připojištění má vliv na víc parametrů
                                if (typeof extra.hodnota.linked === 'object' && extra.hodnota.linked !== null) {
                                    x.params[key].options = extra.hodnota.linked.filter(e => e.kod === key)[0].options;
                                } else {
                                    x.params[key].options = extra.hodnota.options;
                                }
                                x.params[key].default = extra.hodnota.default;
                                if (typeof extra.hodnota.default === 'object' && extra.hodnota.default !== null) {
                                    x.params[key].hodnota = Number(extra.hodnota.default[key]);
                                } else {
                                    x.params[key].hodnota = Number(extra.hodnota.default);
                                }

                            }
                        } else if (x.params[key].typ === 'number') {  // nastavení parametrů podle typu
                            x.params[key].hodnota = Number(x.params[key].hodnota);
                        } else if (x.params[key].typ === 'bool') {
                            x.params[key].hodnota = Number(x.params[key].hodnota);
                            // console.log('APP kalkuluj - param bool : ', JSON.stringify(x.params[key]) );
                        }
                    });
                });
                this.filters.partneri = partneri;
                this.filters.partnobj = partnobj;

                items = items.filter(x => (x.kalkulace === 1 && x.platby[1] > 0));
                items.sort(function (a, b) { return a.platby[1] - b.platby[1]; });

                this.nvoffers = items;

                // console.log('filtry se zachovaným nastavením ', partnobj );
                this.filtruj_nabidky();
                // if (this.prvniPomoc) { this.filtrHint.show(); }
                // setTimeout(() =>  { this.prvniPomoc = false;  }, 8000);
                this.GAEvent('CEST', 'Kalkulace', 'Kalkulace', 1);

            });
    }

    filtruj_nabidky(): void {
        let items = [];
        // console.log('this.filters.partnobj : ', this.filters.partnobj);
        items = this.nvoffers.filter(x => this.filters.partnobj[x.pojistovna] > 0);
        if (this.data.pojisteni === 'CEST') {
            items = items.filter(x => Number(x.params.lvl.hodnota) >= this.filters.lvl);
            items = items.filter(x => Number(x.params.odpz.hodnota)+2 >= this.data.extra.odpz);
            items = items.filter(x => Number(x.params.urtn.hodnota)+2 >= this.data.extra.urtn);
            items = items.filter(x => Number(x.params.zavl.hodnota)+2 >= this.data.extra.zavl);
            // items = items.filter(x => Number(x.params.auto.hodnota) >= this.data.extra.auto);
        }

        // úprava produktu podle požadavku na rozšíření
        items.forEach((x) => {
            let cena_pri = 0;
            const pripojisteni = {};
            let extras = ['auto'];
            let i = 0;
            while (extras[i]) {
                // u "balíčků" musím případně opakovaně ověřovat hodnoty provázaných parametrů
                // extras.forEach( (e) => {
                const e = extras[i];
                i++;
                // console.log('APP filtruj_nabidky - podle : ', e);
                // console.log('APP filtruj_nabidky - e (extra) x (produkt) : ', x.params[e]);
                // má produkt takové připojištění?
                if (typeof x.params[e] === 'object' && x.params[e] !== null && x.params[e].typ === 'link') {
                    // výchozí hodnota
                    if (typeof x.params[e].default === 'object' && x.params[e].default !== null) {
                        Object.keys(x.params[e].default).forEach((p) => {
                            x.params[p].hodnota = x.params[e].default[p];
                        });
                    } else {
                        x.params[e].hodnota = x.params[e].default;
                    }
                    // console.log('APP filtruj_nabidky - x.params.e : ', x.params[e]);
                    if (Number(x.params[e].hodnota) < this.data.extra[e]) { // lze navýšit?
                        // console.log('APP filtruj_nabidky - product kalk : ', x.kalk);
                        const opt = x.params[e].options.filter(o => Number(o.value) >= this.data.extra[e])[0];
                        if (typeof opt === 'object' && opt !== null) {
                            // výběr připojištění ovlivňuje více parametrů produktu
                            if (Array.isArray(opt.linked)) {
                                opt.linked.forEach((p) => {
                                    if (typeof p === 'object' && p !== null) {
                                        const lkod = Object.keys(p)[0];
                                        x.params[lkod].hodnota = p[lkod];
                                        console.log('APP filtruj_nabidky - opt linked : ', lkod + ' ' + p[lkod]);
                                        if (Number(x.params[lkod].hodnota) < this.data.extra[lkod]) {
                                            // když hodnota provázaného parametru nesplňuje filtr, musím znova projít filtrováním
                                            extras.push(lkod);
                                            console.log('APP filtruj_nabidky - nedostatečný opt linked : ', lkod + ' ' + p[lkod] + ' ' + this.data.extra[lkod]);
                                        } else {
                                            // když je hodnota OK, tak znova nechci procházet, byla by nastavena na default parametru
                                            extras = extras.filter(o => o !== lkod);
                                            // a dopočítám cenu - volba provázaného parametru buď podle hodnoty jeho filtru nebo odkazujícího parametru
                                            const lopt = x.params[lkod].options.filter(o => Number(o.value) >= Math.max(this.data.extra[lkod], p[lkod]))[0];
                                            console.log('APP filtruj_nabidky - opt linked dopočítání ceny : ', lopt);
                                            if (typeof lopt === 'object' && lopt !== null) {
                                                pripojisteni[lkod] = Number(lopt.cena);
                                            }
                                            console.log('APP filtruj_nabidky - opt linked pripojisteni : ', pripojisteni);
                                        }
                                    }
                                });
                            }
                            x.params[e].hodnota = Number(opt.value);
                            // console.log('APP filtruj_nabidky - opt[0] : ', opt);
                            pripojisteni[e] = Number(opt.cena);
                            // console.log('APP filtruj_nabidky - pripojisteni : ', pripojisteni);
                        }
                    }
                }
            }
            Object.keys(pripojisteni).forEach(key => { cena_pri += pripojisteni[key]; });
            console.log('APP filtruj_nabidky - cena pripojisteni : ', x.id + ': ' + cena_pri);
            console.log('APP filtruj_nabidky - ceny pripojisteni : ', pripojisteni);

            x.cena += cena_pri;
        });
        items = items.filter(x => Number(x.params.auto.hodnota) >= this.data.extra.auto);

        // console.log('offers po filtrech : ', this.offers);
        // function sortp(c) { return function(a, b) { return a.platby[c] - b.platby[c]; }; }
        // this.offers.sort(sortp(this.data.platba));
        this.offers.sort(function(a, b) { return a.cena - b.cena; });
        this.topped = items.filter(x => (x.top === true));
        this.offers = items.filter(x => (x.top === false));
    }

    initData(data: any): void {
        this.data = data || {
            id: '',
            extra: {
                odpz: 0,
                urtn: 0,
                zavl: 0,
                auto: 0
            },
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

        console.log('verze: ', this.version + '@' + this.aversion);

        this.zadani_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            this.zadani_form.submitted = false;
            // sessionStorage.setItem('zadani_form', JSON.stringify(form));
        });

        this.email_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            this.email_form.submitted = false;
        });

        this.filters = {
            lvl: 0
        };
        this.srovnani = {
            id: '',
            items: [],
            time: ''
        };

        this.initData(null);

        let input_data = null;
        if (this.route.snapshot.queryParams['id'] !== undefined) {
            this.paramsService.getKalkulace(this.route.snapshot.queryParams['id'])
                .subscribe(data => {
                    // console.log('data ', data);
                    try {
                        input_data = data;
                        if (input_data.termin && input_data.termin.length > 1) {
                            const termin = [new Date(input_data.termin[0]), new Date(input_data.termin[1])];
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
                        this.data = Object.assign({}, this.data, input_data);
                    } catch (e) {
                        // console.log(e);
                    }
                    setTimeout(() => {
                        // console.log('zadani_form form valid', this.zadani_form.form.valid );
                        if (this.zadani_form.valid) {
                            this.kalkuluj();
                            this.staticTabs.tabs[1].active = true;
                        }
                    }, 50);
                });
        } else if (this.route.snapshot.queryParams['data'] !== undefined) {
            // console.log('data snapshot', this.route.snapshot.queryParams['data'] );
            try {
                input_data = JSON.parse(this.route.snapshot.queryParams['data']);
                if (input_data.termin && input_data.termin.length > 1) {
                    const termin = [new Date(input_data.termin[0]), new Date(input_data.termin[1])];
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
                this.data = Object.assign({}, this.data, input_data);
            } catch (e) {
                // console.log(e);
            }
        }
        // console.log('input_data ', input_data);
        // this.initData(input_data);
        this.data.ziskatel = window['ziskatel'];
        // console.log('data ', JSON.parse(this.route.snapshot.queryParams['data']));
        // console.log('this.data ', this.data);
    }
}
