import { Moment } from 'moment';

export interface DataPoint {
	id: string;
	date: Moment;
	title: string;
	text: string;
	mood: number;
}