const { Search, Type, Match } = require('masa-search');

const search = new Search();

search.addIndex({
	key: 'name',
	type: Type.WORD
});

search.addIndex({
	key: 'comment',
	type: Type.TEXT
});

search.addIndex({
	key: 'age',
	type: Type.NUMBER
})

const data = [
	{ name: 'Albert', comment: 'He is cool', age: 25 },
	{ name: 'Berta', comment: 'She is cool', age: 50 },
	{ name: 'Charlie', comment: 'He is cool too', age: 35 }
];

search.addData(data);

const query = {
	and: [
		{
			condition: {
				index: {
					key: 'age',
					type: Type.NUMBER
				},
				match: Match.GT,
				value: 30
			}
		}, {
			or: [
				{
					condition: {
						index: {
							key: 'comment',
							type: Type.TEXT
						},
						value: 'cool too'
					}
				}, {
					condition: {
						index: {
							key: 'name',
							type: Type.WORD
						},
						value: 'Albert'
					}
				}
			]
		}
	]
};

console.log(search.find(query));