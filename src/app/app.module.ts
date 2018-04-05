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
import { HttpClientModule } from '@angular/common/http';
import { SearchButtonComponent } from './components/search-button/search-button.component';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
    	HistoryElementComponent,
    	AddNewButtonComponent,
    	AddNewDialogComponent,
    	SearchButtonComponent,
    	SearchDialogComponent
	],
	entryComponents: [
		AddNewDialogComponent,
		SearchDialogComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		ModalDialogModule.forRoot(),
		MasaUiElementsModule,
		FormsModule,
		HttpClientModule
	],
	providers: [
		DataService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
