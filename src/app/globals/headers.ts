import { HttpHeaders } from '@angular/common/http';

export const JSON_HEADER: HttpHeaders = new HttpHeaders({
	'Content-Type': 'application/json'
});

export const TEXT_HEADER: HttpHeaders = new HttpHeaders({
	'Content-Type': 'text/plain'
});