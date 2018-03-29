import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { AddNewDialogComponent } from '../add-new-dialog/add-new-dialog.component';

@Component({
  selector: 'app-add-new-button',
  templateUrl: './add-new-button.component.html',
  styleUrls: ['./add-new-button.component.scss']
})
export class AddNewButtonComponent {
	constructor(private modalService: ModalDialogService, private viewRef: ViewContainerRef) { }

	onClick(): void {
		this.modalService.openDialog(this.viewRef, {
			title: 'New entry',
			childComponent: AddNewDialogComponent
		});
	}
}
