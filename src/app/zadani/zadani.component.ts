import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ZEME } from '../../assets/params/zeme';

// Data and Service
// import { IOption } from 'ng-select';

@Component({
    selector: 'app-zadani',
    templateUrl: './zadani.component.html',
    styleUrls: ['./zadani.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ZadaniComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() lists;

    @ViewChild('zadani') poj_input: any;

    constructor(private localeService: BsLocaleService) { }

    locale = 'cs';
    bsConfig: Partial<BsDatepickerConfig>;
    minDate: Date;
    maxDate: Date;
    flag(data: string): string {
        return '<img src="https://www.srovnavac.cz/components/com_cestovka/assets/images/flags/' + data.toLowerCase() + '.png">';
    }

    ZmenaData(value: Date[]): void {
        try {
            if (value.length) {
                const Dod = new Date(value[0]);
                const Ddo = new Date(value[1]);
                this.data.pocet_dnu = Math.round(Math.abs((+Ddo) - (+Dod)) / 8.64e7) + 1;
            }
        } catch (e) {
            // console.log(e);
        }
    }

    PocetOsob(i: number): void {
        if (i) { this.data.pocet_osob = i; }
        this.data.pocet_osob = Math.min (30, Math.max(1, this.data.pocet_osob));
        while (this.data.osoby.length < this.data.pocet_osob) {
            this.data.osoby.push({});
        }
        if (this.data.osoby.length > this.data.pocet_osob) { this.data.osoby.length = this.data.pocet_osob; }
    }

    ngOnInit() {
        this.localeService.use(this.locale);
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition: false, dateInputFormat: 'D.M.YYYY' });
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 0);
        this.maxDate.setDate(this.maxDate.getDate() + 365);
        this.PocetOsob(0);
        this.lists.zeme = ZEME;
        // console.log('this.data ', this.data);
    }
}
