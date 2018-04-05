import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent {
	constructor(private modalService: ModalDialogService, private viewRef: ViewContainerRef) { }

	onClick(): void {
		this.modalService.openDialog(this.viewRef, {
			title: 'Search..',
			childComponent: SearchDialogComponent
		});
	}
}
