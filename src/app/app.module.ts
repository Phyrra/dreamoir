import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HistoryElementComponent } from './components/history-element/history-element.component';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { AddNewButtonComponent } from './components/add-new-button/add-new-button.component';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { AddNewDialogComponent } from './components/add-new-dialog/add-new-dialog.component';
import { MasaUiElementsModule } from 'masa-ui-elements'
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
    	HistoryElementComponent,
    	AddNewButtonComponent,
    	AddNewDialogComponent
	],
	entryComponents: [
		AddNewDialogComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		ModalDialogModule.forRoot(),
		MasaUiElementsModule,
		FormsModule
	],
	providers: [
		DataService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
