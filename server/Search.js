var moment = require('moment');
var _ = require('lodash');
var guid = require('./guid');

const Type = {
	WORD: 'word',
	TEXT: 'text',
	NUMBER: 'number',
	DATE: 'date'
};

class Search {
	constructor() {
		this._indexes = [];
		this._indexedData = {};

		this._transformers = {
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
	
				return value.toLowerCase().split(/\s+/);
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
	
				return [moment(value).format('YYYY-MM-DD')];
			}
		};
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
				if (!this._transformers.hasOwnProperty(index.type)) {
					throw new Error(`Unknown type ${index.type}`);
				}

				const keys = this._transformers[index.type](_.get(item, index.key, null));

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

	find(search) {
		const andCombine = (allResults, singleResults, endResults) => {
			return Object.keys(allResults)
				.filter(id => {
					return singleResults.every(result => result[id]);
				})
				.forEach(id => endResults[id] = allResults[id]);
		};

		const results = {};

		// Combines all queries with OR
		// TODO: Allow more sophisticated searches
		search.forEach(query => {
			if (!this._transformers.hasOwnProperty(query.index.type)) {
				throw new Error(`Unknown type ${index.type}`);
			}

			const indexedData = this._indexedData[query.index.key];
			if (!indexedData) {
				return;
			}

			const values = this._transformers[query.index.type](query.value);

			const valueResults = [];
			const possibleResults = {};

			values.forEach(value => {
				const temporaryResults = {};
				valueResults.push(temporaryResults);

				const partialResults = indexedData[value];
				if (!partialResults) {
					return;	
				}

				partialResults.forEach(result => {
					temporaryResults[result.id] = true;
					possibleResults[result.id] = result.item;
				});
			});

			andCombine(possibleResults, valueResults, results);

			/*
			values.forEach(value => {
				const partialResults = indexedData[value];
				if (!partialResults) {
					return;
				}
	
				partialResults.forEach(result => {
					results[result.id] = result.item;
				});
			});
			*/
		});

		return Object.keys(results)
			.map(key => results[key]);
	}
}

module.exports = {
	Search: Search,
	Type: Type
};
