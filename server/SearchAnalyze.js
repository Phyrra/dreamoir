function analyze(search) {
	const dates = search.match(/([<>]=?|=)\s*\d{1,2}\.\d{1,2}\.(\d{4}|\d{2})/g);

	if (dates) {
		dates.forEach(date => {
			search = search.replace(date, '');
		});
	}

	const numbers = search.match(/([<>]=?|=)\s*\-?(\d+|\d*\.\d+|\d+\.\d*)/g);
	
	if (numbers) {
		numbers.forEach(number => {
			search = search.replace(number, '');
		});
	}

	const words = search.trim().split(/\s+/)
		.filter(word => word.length > 0);

	return {
		dates: dates,
		numbers: numbers,
		words: words.length > 0 ? words : null
	};
}

module.exports = {
	analyze: analyze
};
