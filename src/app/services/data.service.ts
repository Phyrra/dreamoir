import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DataPoint } from '../interfaces/DataPoint.interface';
import * as moment from 'moment';

const testData = require('../../../test-data/history.json')

@Injectable()
export class DataService {
	getHistory(): Observable<DataPoint[]> {
		return Observable.of(
			testData
				.map(elem => {
					return {
						date: moment(elem.date),
						title: elem.title,
						text: elem.text
					};
				})
			);
	}
}
