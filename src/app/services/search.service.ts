import { Injectable, EventEmitter } from '@angular/core';
import { DataPoint } from '../interfaces/DataPoint.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { buildQueryString, JSON_HEADER } from '../globals/http.util';

declare type SearchEvent = string[];

export interface SearchDataEvent {
	query: string;
	data: DataPoint[];
}

@Injectable()
export class SearchService {
	private search: EventEmitter<SearchDataEvent> = new EventEmitter<SearchDataEvent>();
	private searches: EventEmitter<SearchEvent> = new EventEmitter<SearchEvent>();

	private searchHistory: string[] = [];

	constructor(private http: HttpClient) {}

	searchEntries(query: string): Observable<DataPoint[]> {
		const queryObj = {
			query: query
		};

		return this.http.get<DataPoint[]>(`api/history/search?${buildQueryString(queryObj)}`, { headers: JSON_HEADER })
			.do(results => {
				this.emitSearchResults(query, results);
				this.emitSearch(query);
			});
	}

	getResultSubscription(): EventEmitter<SearchDataEvent> {
		return this.search;
	}

	getSearchSubscription(): EventEmitter<SearchEvent> {
		setTimeout(() => {
			this.searches.emit(this.searchHistory);
		});

		return this.searches;
	}

	private emitSearchResults(query: string, data: DataPoint[]): void {
		this.search.emit({
			query: query,
			data: data
		});
	}

	private emitSearch(query: string): void {
		const lowerSearch = query.toLowerCase();
		const idx = this.searchHistory.findIndex(elem => elem.toLowerCase() === query);
		if (idx !== -1) {
			this.searchHistory.splice(idx, 1);
		}
		
		this.searchHistory.unshift(query);
		this.searchHistory = this.searchHistory.slice(0, 5);

		this.searches.emit(this.searchHistory);
	}
}
