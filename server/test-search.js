const _search = require('./Search');
const Search = _search.Search;
const Type = _search.Type;

const search = new Search();

search.addIndex({
	key: 'name',
	type: Type.WORD
});

search.addIndex({
	key: 'comment',
	type: Type.TEXT
});

const data = [
	{ name: 'Albert', comment: 'He is cool' },
	{ name: 'Berta', comment: 'She is cool' },
	{ name: 'Charlie', comment: 'He is cool too' }
];

search.addData(data);

console.log(search.find([
	{
		index: {
			key: 'name',
			type: Type.WORD
		},
		value: 'Albert'
	}
]));

console.log('---');

console.log(search.find([
	{
		index: {
			key: 'comment',
			type: Type.TEXT
		},
		value: 'he too'
	}
]));

