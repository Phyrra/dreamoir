var moment = require('moment');
var _ = require('lodash');
var guid = require('./guid');

const DATE_FORMAT = 'YYYY-MM-DD';

const Type = {
	WORD: 'word',
	TEXT: 'text',
	NUMBER: 'number',
	DATE: 'date'
};

const Match = {
	EQ: '=',
	GT: '>',
	LT: '<',
	GTE: '>=',
	LTE: '<='
};

const transformers = {
	[Type.WORD]: (value) => {
		if (!value) {
			return [];
		}

		return [value.toLowerCase()];
	},
	[Type.TEXT]: (value) => {
		if (!value) {
			return [];
		}

		return value.trim().toLowerCase().split(/\s+/);
	},
	[Type.NUMBER]: (value) => {
		if (value == null) {
			return [];
		}

		return [value.toString()];
	},
	[Type.DATE]: (value) => {
		if (value == null) {
			return [];
		}

		return [moment(value).format(DATE_FORMAT)];
	}
};

class Search {
	constructor() {
		this._indexes = [];
		this._indexedData = {};
	}

	addIndex(index) {
		this._indexes.push(index);
	}

	addData(data) {
		data.forEach(item => {
			const wrappedItem = {
				id: guid(),
				item: item
			};

			this._indexes.forEach(index => {
				if (!transformers.hasOwnProperty(index.type)) {
					throw new Error(`Unknown type ${index.type}`);
				}

				const keys = transformers[index.type](_.get(item, index.key, null));

				keys.forEach(key => {
					if (!this._indexedData.hasOwnProperty(index.key)) {
						this._indexedData[index.key] = {};
					}

					const indexedData = this._indexedData[index.key];

					if (!indexedData.hasOwnProperty(key)) {
						indexedData[key] = [];
					}

					indexedData[key].push(wrappedItem);
				});
			});
		});
	}

	_getCommonElements(allResults, singleResults) {
		const endResults = {};
	
		Object.keys(allResults)
			.filter(id => {
				return singleResults.every(result => result[id]);
			})
			.forEach(id => endResults[id] = allResults[id]);
	
		return endResults;
	}

	_andCombine(singleResults) {
		const allResults = {};

		singleResults.forEach(result => {
			Object.keys(result)
				.forEach(id => allResults[id] = result[id]);
		});

		return this._getCommonElements(allResults, singleResults);
	}

	_orCombine(singleResults) {
		const endResults = {};

		singleResults.forEach(result => {
			Object.keys(result)
				.forEach(id => endResults[id] = result[id]);
		});

		return endResults;
	}

	_extractMatchingResults(query, value, indexedData) {
		if (query.index.type === Type.WORD || query.index.type === Type.TEXT || query.match === Match.EQ) {
			return indexedData[value];
		}

		let partialResults = [];

		switch (query.index.type) {
			case Type.NUMBER:
				const numValue = Number(value);

				Object.keys(indexedData)
					.forEach(key => {
						const number = Number(key);

						switch (query.match) {
							case Match.GT:
								if (number > numValue) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.LT:
								if (number < numValue) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.GTE:
								if (number >= numValue) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.LTE:
								if (number <= numValue) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							default:
								throw new Error(`Unknown matcher ${query.match}`);
						}
					});

				break;
			case Type.DATE:
				const dateValue = moment(value, DATE_FORMAT);

				Object.keys(indexedData)
					.forEach(key => {
						const date = moment(key, DATE_FORMAT);

						switch (query.match) {
							case Match.GT:
								if (date.isAfter(dateValue, 'day')) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.LT:
								if (date.isBefore(dateValue, 'day')) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.GTE:
								if (date.isSameOrAfter(dateValue, 'day')) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							case Match.LTE:
								if (date.isSameOrBefore(dateValue, 'day')) {
									partialResults = partialResults.concat(indexedData[key]);
								}

								break;
							default:
								throw new Error(`Unknown matcher ${query.match}`);
						}
					});

				break;
			default:
				throw new Error(`Unknown type ${query.index.type}`);
		}

		return partialResults;
	}

	_findSingleQueryResult(query) {
		if (!transformers.hasOwnProperty(query.index.type)) {
			throw new Error(`Unknown type ${index.type}`);
		}
	
		const indexedData = this._indexedData[query.index.key];
		if (!indexedData) {
			return;
		}

		const values = transformers[query.index.type](query.value);
	
		const valueResults = [];
		const possibleResults = {};
	
		values.forEach(value => {
			const temporaryResults = {};
			valueResults.push(temporaryResults);

			const partialResults = this._extractMatchingResults(query, value, indexedData);
			if (!partialResults || partialResults.length === 0) {
				return;	
			}

			partialResults.forEach(result => {
				temporaryResults[result.id] = true;
				possibleResults[result.id] = result.item;
			});
		});
	
		return this._getCommonElements(possibleResults, valueResults);
	}

	_findPartial(search) {
		if (search.hasOwnProperty('condition')) {
			return this._findSingleQueryResult(search.condition);
		} else if (search.hasOwnProperty('and')) {
			return this._andCombine(
				search.and.map(condition => {
					return this._findPartial(condition);
				})
			);
		} else if (search.hasOwnProperty('or')) {
			return this._orCombine(
				search.or.map(condition => {
					return this._findPartial(condition);
				})
			);
		}

		throw new Error('Search should have one of [condition, and, or]');
	}

	find(search) {
		const results = this._findPartial(search);

		return Object.keys(results)
			.map(key => results[key]);
	}
}

module.exports = {
	Search: Search,
	Type: Type,
	Match: Match
};
