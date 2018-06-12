import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataService {
    private url = 'http://api.openweathermap.org/data/2.5/forecast';  /*APPID=d9750a0455b0ee4767dcb3ff1adebbf0*/

    constructor(private http: HttpClient) {}



    getWeather(id = 2643743): Observable<any> {
        console.log(typeof id);
        if (typeof id === 'number') {
            return this.http.get(`${this.url}?id=${id}&APPID=d9750a0455b0ee4767dcb3ff1adebbf0`);
        } else {
            return this.http.get(`${this.url}?q=${id}&APPID=d9750a0455b0ee4767dcb3ff1adebbf0`);
        }
    }
}

