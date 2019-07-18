import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({
    name: 'menaFormat'
})
export class MenaFormatPipe implements PipeTransform {

    transform(value: string): string {
        let res = '';
        if (!isNaN(Number(value)) && Number(value)) {
            const cislo = Math.round( Number(value || ''));
            if (cislo > 0) {
                if (cislo === 999999999) {
                    res = 'neomezeno';
                } else if (false) {
//                if ((cislo % 100000) === 0) {
//                    res = '<div class="text-right">' + (cislo / 1000000).toString() + '&nbsp;mil.&nbsp;Kč</div>';
//                } else if ((cislo % 1000) === 0) {
//                    res = (cislo / 1000).toString() + '&nbsp;tis.&nbsp;Kč';
                } else {
                    // console.log('menaPipe ', cislo);
                    res = '<div class="text-right">' + cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč</div>';
                }
            } else if (cislo === -1) {
                res = '<div class="text-right"><i class="mr-4 text-primary far fa-lg fa-plus-square"></i></div>';
            } else if (cislo === -2) {
                res = '<div class="text-right"><i class="mr-4 text-danger fas fa-lg fa-times"></i></div>';
            }
        }
        return res;
    }

    /*
    transform(value: string): string {
        let res = '';
        if (!isNaN(Number(value)) && Number(value)) {
            const cislo = Math.round( Number(value || ''));
            if (cislo > 0) {
                res = cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč';
            }
        }
        return res;
    }
    */
}
