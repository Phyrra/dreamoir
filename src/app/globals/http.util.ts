import { HttpHeaders } from '@angular/common/http';

export const JSON_HEADER: HttpHeaders = new HttpHeaders({
	'Content-Type': 'application/json'
});

export const TEXT_HEADER: HttpHeaders = new HttpHeaders({
	'Content-Type': 'text/plain'
});

export function buildQueryString(queryParams: { [key: string]: string }): string {
    if (!queryParams) {
      return '';
    }

    return Object.keys(queryParams)
		.map(key =>
		(queryParams[key] == null || queryParams[key] === '') // 0 might be a legal value
			? ''
			: `${key.toLowerCase()}=${encodeURIComponent(queryParams[key])}`)
		.filter(term => !!term)
		.join('&');
  }