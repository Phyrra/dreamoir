import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HistoryElementComponent } from './components/history-element/history-element.component';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

@NgModule({
	declarations: [
		AppComponent,
    	HistoryElementComponent
	],
	imports: [
		BrowserModule,
		CommonModule
	],
	providers: [
		DataService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
