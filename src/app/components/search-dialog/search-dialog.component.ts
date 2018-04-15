import { Component, ComponentRef, ViewChild, AfterViewInit } from '@angular/core';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { DataService } from '../../services/data.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements IModalDialog, AfterViewInit {
	actionButtons: IModalDialogButton[] = [
		{ text: 'Cancel', onAction: () => true },
		{
			text: 'Search',
			onAction: () => {
				return this.search.searchEntries(this.query)
					.map(() => true);
			}
		}
	];

	private options: Partial<IModalDialogOptions<any>>;

	query: string;
	searchHistory: string[];

	@ViewChild('autofocus') titleElement: any; // MasaInputComponent

	constructor(private search: SearchService) {}

	dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
		this.options = options;

		this.search.getSearchSubscription()	
			.subscribe(searchHistory => {
				this.searchHistory = searchHistory;
			});
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.titleElement.focus();
		}); // Prevent Errors
	}

	onClickSearch(query: string): void {
		this.search.searchEntries(query)
			.subscribe(() => {
				this.options.closeDialogSubject.next();
			});
	}
}
