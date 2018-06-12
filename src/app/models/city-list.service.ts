import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CityListService {
    private _url = 'assets/city.list.json';
    private _urlMin = 'assets/city.list.min.json';

    constructor(private _http: HttpClient) {}

    getCityList () {
        return this._http.get(this._urlMin);
    }
}

