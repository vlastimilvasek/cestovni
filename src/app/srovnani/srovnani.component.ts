import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { LOGO_200x100 } from '../../assets/params/loga';
import { trigger, transition, style, animate, keyframes, query, stagger, animateChild } from '@angular/animations';
/*
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfSrovnani from '../_pdf-templates/srovnani';
*/

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani.component.html',
    styleUrls: ['./srovnani.component.css'],
    animations: [
        trigger('items', [
          transition('void => *', [
            animate(300, keyframes([
              style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
              style({opacity: 1, transform: 'translateX(15px)', offset: 0.2}),
              style({opacity: 1, transform: 'translateX(0)', offset: 0.8})
            ]))
          ]),
          transition('* => void', [
            animate(300, keyframes([
              style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
              style({opacity: 1, transform: 'translateX(-15px)', offset: 0.6}),
              style({opacity: 0, transform: 'translateX(100%)',  offset: 0.8})
            ]))
          ]),
        ]),
        trigger('list', [
          transition(':enter', [
            query('@items', stagger(150, animateChild()), { optional: true })
          ]),
        ])
    ]
})
export class SrovnaniComponent implements OnInit {
    @Input() offers;
    @Input() filters;
    @Input() nvoffers;
    @Input() data;
    @Input() layout;
    @Input() staticTabs;
    LOGA = LOGO_200x100;

    constructor() {
        // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    public openPDF(): void {
        // const dd = pdfSrovnani.srovnani(this.offers);
        // pdfMake.createPdf(dd).download('nabídky - ' + '.pdf');
    }

    GAEvent(cat: string, label: string, action: string, val: number): void {
        console.log('GAEvent', label);
        (<any>window).ga('send', 'event', {
            eventCategory: cat,
            eventLabel: label,
            eventAction: action,
            eventValue: val
        });
    }

    partneriVse(ev): void {
        this.filters.partneri.forEach(x => this.filters.partnobj[x] = true);
    }

    priprav_data(): void {
    }

    ngOnInit() {

    }

}
