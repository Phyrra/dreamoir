import { Component, ComponentRef, ViewChild, AfterViewInit } from '@angular/core';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { DataService } from '../../services/data.service';
import { isBlank } from '../../globals/string.util';

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrls: ['./add-new-dialog.component.scss']
})
export class AddNewDialogComponent implements IModalDialog, AfterViewInit {
	actionButtons: IModalDialogButton[] = [
		{ text: 'Cancel', onAction: () => true },
		{
			text: 'Save',
			onAction: () => {
				if (isBlank(this.title) || isBlank(this.text)) {
					return false;
				}

				return this.data.saveEntry(this.title, this.text, this.mood);
			}
		}
	];

	title: string;
	text: string;
	mood: number = 2;

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

	onSelectMood(mood: number): void {
		this.mood = mood;
	}
}
