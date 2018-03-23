import { Moment } from 'moment';

export interface DataPoint {
	date: Moment;
	title: string;
	text: string;
}