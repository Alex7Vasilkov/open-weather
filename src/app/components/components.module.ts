import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {CityListService} from '../models/city-list.service';
import {DataService} from '../models/data.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [CityListService, DataService],
    declarations: [ HomeComponent],
    exports: [HomeComponent]
})
export class ComponentsModule {
}
