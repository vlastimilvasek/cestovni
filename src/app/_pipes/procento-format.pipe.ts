import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'procentoFormat'
})
export class ProcentoFormatPipe implements PipeTransform {

    transform(value: string): string {
        let res = '';
        if (!isNaN(Number(value)) && Number(value)) {
            const cislo = Math.round (Number(value) * 10000) / 100;
            res = cislo.toString().replace('.', ',') + '%';
        } else {
            res = value;
        }
        return res;
    }

}
