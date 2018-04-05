import { Component, ComponentRef, ViewChild, AfterViewInit } from '@angular/core';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { DataService } from '../../services/data.service';

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
				return this.data.searchEntries(this.search)
					.map(results => {
						console.log(results);

						return true;
					});
			}
		}
	];

	search: string;

	@ViewChild('autofocus') titleElement: any; // MasaInputComponent

	constructor(private data: DataService) {}

	dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
		// no processing needed
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.titleElement.focus();
		}); // Prevent Errors
	}
}
