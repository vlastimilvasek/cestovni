import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { LOGO_200x100 } from '../../assets/params/loga';

@Component({
    selector: 'app-filtry',
    templateUrl: './filtry.component.html',
    styleUrls: ['./filtry.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FiltryComponent implements OnInit {
    @Input() data;
    @Input() filters;
    @Input() offers;
    @Input() nvoffers;
    LOGA = LOGO_200x100;

    constructor() { }

    partneriVse(ev): void {
        this.filters.partneri.forEach(x => this.filters.partnobj[x] = true);
    }
    ngOnInit() {
    }

}
