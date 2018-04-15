import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { DataPoint } from './interfaces/DataPoint.interface';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	historyData: DataPoint[] = [];

	searchQuery: string = null;
	searchResults: { [key: string]: boolean } = null;
	
	constructor(private data: DataService, private search: SearchService) {}

	ngOnInit(): void {
		this.data.getHistory()
			.subscribe(data => {
				this.historyData = data;

				setTimeout(() => {
					window.scrollTo(0, document.body.scrollHeight);
				}, 10);
			});

		this.search.getResultSubscription()
			.subscribe(event => {
				this.searchQuery = event.query;

				this.searchResults = {};
				event.data.forEach(point => this.searchResults[point.id] = true);
			});
	}

	onResetSearch(): void {
		this.searchQuery = null;
		this.searchResults = null;
	}
}
