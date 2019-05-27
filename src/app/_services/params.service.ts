import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISrovnani, ISjednaniResp } from '../_interfaces/cestovni';

@Injectable()
export class ParamsService {

    constructor(private http: HttpClient) { }

    getKalkulace(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        const data = {'id': id};
        // console.log('id kalkulace ', data);
        return this.http.post('https://www.srovnavac.eu/api/cestovni/app/kalkulace', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    KalkulaceEmail(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        return this.http.post('https://www.srovnavac.eu/api/cestovni/app/emailkalk', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    getSrovnani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        return this.http.post<ISrovnani>('https://www.srovnavac.eu/api/cestovni/app/srovnani', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    ulozSjednani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        // console.log(JSON.stringify(data));
        return this.http.post<ISjednaniResp>('https://www.srovnavac.eu/api/cestovni/app/sjednani', data, httpOptions)
        .pipe(
            // catchError(this.handleError('addHero', hero))
        );
    }
}
