import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'star'
})
export class StarPipe implements PipeTransform {

    transform(value: string): string {
        let res = '<span class="starhod">';
        let cislo = 0;
        if (!isNaN(Number(value)) && Number(value)) {
            cislo = Math.round (Number(value));
            cislo = Math.max(0, cislo);
            cislo = Math.min(5, cislo);
        }
        for (let i = 1; i <= 5; i++) {
            res += (cislo >= i ? '<i class="fa fa-star">' : '<i class="far fa-star">');
        }
        res += '</span>';
        return res;
    }

}
