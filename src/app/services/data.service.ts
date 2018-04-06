import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DataPoint } from '../interfaces/DataPoint.interface';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { JSON_HEADER, TEXT_HEADER, buildQueryString } from '../globals/http.util';

export interface SearchEvent {
	query: string;
	data: DataPoint[];
}

@Injectable()
export class DataService {
	private listOfEntries: DataPoint[] = [];
	private stream: EventEmitter<DataPoint[]> = new EventEmitter<DataPoint[]>();
	private search: EventEmitter<SearchEvent> = new EventEmitter<SearchEvent>();

	constructor(private http: HttpClient) {}

	private mapElement(elem: any): DataPoint {
		return {
			id: elem.id,
			date: moment(elem.date),
			title: elem.title,
			text: elem.text,
			mood: elem.mood || 2
		};
	};

	getHistory(): EventEmitter<DataPoint[]> {
		this.http.get<DataPoint[]>('api/history', { headers: JSON_HEADER })
			.map(data =>
				data
					.map(elem => this.mapElement(elem))
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
		return this.http.post('api/history', { title: title, text: text, mood: mood }, { headers: JSON_HEADER })
			.map(result => {
				console.log(result);
				this.listOfEntries.push(this.mapElement(result));

				this.stream.emit(this.listOfEntries);

				return true;
			});
	}

	searchEntries(query: string): Observable<DataPoint[]> {
		const queryObj = {
			query: query
		};

		return this.http.get<DataPoint[]>(`api/history/search?${buildQueryString(queryObj)}`, { headers: JSON_HEADER });
	}

	searchSubscription(): EventEmitter<SearchEvent> {
		return this.search;
	}

	emitSearchResults(query: string, data: DataPoint[]): void {
		this.search.emit({
			query: query,
			data: data
		});
	}
}
