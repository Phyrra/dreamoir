import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { DataPoint } from './interfaces/DataPoint.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	historyData: DataPoint[] = [];
	searchResults: { [key: string]: boolean } = null;
	
	constructor(private data: DataService) {}

	ngOnInit(): void {
		this.data.getHistory()
			.subscribe(data => {
				this.historyData = data;

				setTimeout(() => {
					window.scrollTo(0, document.body.scrollHeight);
				}, 10);
			});

		this.data.searchSubscription()
			.subscribe(data => {
				this.searchResults = {};

				data.forEach(point => this.searchResults[point.id] = true);
			});
	}
}
