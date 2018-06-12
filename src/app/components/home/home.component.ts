import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {chart, DataPoint} from 'highcharts';
import * as Highcharts from 'highcharts';
import {CityListService} from '../../models/city-list.service';
import {DataService} from '../../models/data.service';

declare let jQuery;

@Component({
    selector: 'wm-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    public weather;

    private tempList: any[] = [];
    private windList: any[] = [];
    private pressureList: any[] = [];
    private humidityList: any[] = [];

    private cities: string[] = [];
    private fullCities: any;

    private chartMode: string = 'temp';
    private chartCreate: boolean = false;

    @ViewChild('chartTarget') chartTarget: ElementRef;

    chart: Highcharts.ChartObject;
    options: Highcharts.Options = {
        chart: { type: 'column' },
        title: { text: '' },
        xAxis: { type: 'category' },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: { enabled: false },
        plotOptions: {
            series: {
                dataLabels: { enabled: true, format: '{point.y}' }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.date.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
        },
        'series': [ { 'name': '', 'data': [] } ],
    };


    @ViewChild('city') element: ElementRef<any>;

    constructor(private cl: CityListService,
                private ds: DataService) {}

    ngOnInit() {
        this.getCityList();
        this.getWeather();
    }

    ngAfterViewInit() {}

    getWeather(currentCiti?) {
        this.ds.getWeather(currentCiti).subscribe(res => {
            this.prepareData(res);
            if (this.chartCreate) {
                this.redrawChart(this.chartMode);
            } else {
                this.rendererChart(res);
            }
        });
    }

    prepareData(res) {
        this.weather = res;
        this.tempList = [];
        this.windList = [];
        this.pressureList = [];
        this.humidityList = [];
        const offsetIndex = this.offsetIndex(res.list[0].dt_txt);
        res.list.filter((item, index) => (index - offsetIndex) % 8 === 0).map(
            item => {
                this.tempList.push({'name': this.dateFormat(item.dt_txt), 'y': this.celsiusFormat(item.main.temp)});
                this.windList.push({'name': this.dateFormat(item.dt_txt), 'y': item.wind.speed});
                this.pressureList.push({'name': this.dateFormat(item.dt_txt), 'y': item.main.pressure});
                this.humidityList.push({'name': this.dateFormat(item.dt_txt), 'y': item.main.humidity});
            }
        );
    }

    dateFormat(someDate: string): string {
        const date = new Date(someDate);
        switch (date.getMonth()) {
            case 0: return `${date.getDate()} Jan`;
            case 1: return `${date.getDate()} Feb`;
            case 2: return `${date.getDate()} Mar`;
            case 3: return `${date.getDate()} Apr`;
            case 4: return `${date.getDate()} May`;
            case 5: return `${date.getDate()} Jun`;
            case 6: return `${date.getDate()} Jul`;
            case 7: return `${date.getDate()} Aug`;
            case 8: return `${date.getDate()} Sep`;
            case 9: return `${date.getDate()} Oct`;
            case 10: return `${date.getDate()} Nov`;
            case 11: return `${date.getDate()} Dec`;
        }
    }

    convertDate(date): number {
        return new Date(date).getTime();
    }

    celsiusFormat(K: number): number {
        return Math.round(K - 273.15);
    }

    switchModes(chartMode) {
        this.chartMode = chartMode;
        switch (chartMode) {
            case 'temp': this.options.series[0].data = this.tempList; break;
            case 'wind': this.options.series[0].data = this.windList; break;
            case 'pressure': this.options.series[0].data = this.pressureList; break;
            case 'humidity': this.options.series[0].data = this.humidityList; break;
        }
    }

    rendererChart(res) {
        this.chartCreate = true;
        const offsetIndex = this.offsetIndex(res.list[0].dt_txt);
        res.list.filter((item, index) => (index - offsetIndex) % 8 === 0).map(
            item => {
                this.options.series[0].data.push({'name': this.dateFormat(item.dt_txt), 'y': this.celsiusFormat(item.main.temp)});
            }
        );
        this.chart = chart(this.chartTarget.nativeElement, this.options);
    }

    redrawChart(chartMode) {
        this.switchModes(chartMode);
        this.chart.series[0].setData(this.options.series[0].data as DataPoint[]);
    }

    getCityList() {
        this.cl.getCityList().subscribe(
            data => {
                this.fullCities = data;
                this.cities = this.fullCities.map(item => item.name);
                let jqObj = jQuery(this.element.nativeElement).autocomplete({
                    minLength: 4,
                    source: this.cities || [],
                    delay: 500
                });
            }
        );
    }

    search(city) {
        const currentCity = this.cities.indexOf(city);
        const currentFullCity =  this.fullCities[currentCity];
        if (currentCity !== -1) {
            this.getWeather(currentFullCity.id);
        } else {
            this.getWeather(city);
        }
    }

    offsetIndex(time: string): number {
        const date = new Date(time).getHours();
        switch (date) {
            case 0: return 11;
            case 3: return 10;
            case 6: return 9;
            case 9: return 8;
            case 12: return 7;
            case 15: return 6;
            case 18: return 5;
            case 21: return 4;
        }
    }

}



