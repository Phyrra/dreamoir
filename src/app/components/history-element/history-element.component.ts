import { Component, Input } from '@angular/core';
import { DataPoint } from '../../interfaces/DataPoint.interface';

@Component({
  selector: 'app-history-element',
  templateUrl: './history-element.component.html',
  styleUrls: ['./history-element.component.scss']
})
export class HistoryElementComponent {
	@Input() data: DataPoint;

	DATE_FORMAT: string = 'DD.MM.YYYY';
}
