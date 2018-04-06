var moment = require('moment');
var _ = require('lodash');
var guid = require('./guid');

const Type = {
	WORD: 'word',
	TEXT: 'text',
	NUMBER: 'number',
	DATE: 'date'
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

		return [moment(value).format('YYYY-MM-DD')];
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
	
			const partialResults = indexedData[value];
			if (!partialResults) {
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
	Type: Type
};
