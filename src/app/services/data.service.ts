import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DataPoint } from '../interfaces/DataPoint.interface';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { JSON_HEADER, TEXT_HEADER } from '../globals/headers';

@Injectable()
export class DataService {
	private listOfEntries: DataPoint[] = [];
	private stream: EventEmitter<DataPoint[]> = new EventEmitter<DataPoint[]>();

	constructor(private http: HttpClient) {}

	getHistory(): EventEmitter<DataPoint[]> {
		this.http.get<DataPoint[]>('api/history', { headers: JSON_HEADER })
			.map(data =>
				data
					.map(elem => {
						return {
							date: moment(elem.date),
							title: elem.title,
							text: elem.text,
							mood: elem.mood || 2
						};
					})
			)
			.subscribe(result => {
				this.listOfEntries = result;
				this.stream.emit(this.listOfEntries);
			});

		return this.stream;
	}

	getHistorySubscription(): EventEmitter<DataPoint[]> {
		return this.stream;
	}

	saveEntry(title: string, text: string, mood: number): Observable<boolean> {
		return this.http.post('api/history', { title: title, text: text, mood: mood }, { headers: JSON_HEADER, responseType: 'text' })
			.map(() => {
				this.listOfEntries.push({
					date: moment(new Date()),
					title: title,
					text: text,
					mood: mood
				});

				this.stream.emit(this.listOfEntries);

				return true;
			});
	}
}
