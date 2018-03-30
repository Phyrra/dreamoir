import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { DataPoint } from '../interfaces/DataPoint.interface';
import * as moment from 'moment';

const testData = require('../../../test-data/history.json')

@Injectable()
export class DataService {
	private listOfEntries: DataPoint[] = [];
	private stream: EventEmitter<DataPoint[]> = new EventEmitter<DataPoint[]>();

	getHistory(): EventEmitter<DataPoint[]> {
		Observable
			.of(
				testData
					.map(elem => {
						return {
							date: moment(elem.date),
							title: elem.title,
							text: elem.text
						};
					})
			)
			.delay(100)
			.subscribe(result => {
				this.listOfEntries = result;
				this.stream.emit(this.listOfEntries);
			});

		return this.stream;
	}

	getHistorySubscription(): EventEmitter<DataPoint[]> {
		return this.stream;
	}

	saveEntry(title: string, text: string): Observable<boolean> {
		return Observable.of(
			true
		)
			.do(() => {
				this.listOfEntries.push({
					date: moment(new Date()),
					title: title,
					text: text
				});

				this.stream.emit(this.listOfEntries);
			});
	}
}
