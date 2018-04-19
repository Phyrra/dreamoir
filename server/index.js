const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFormat = require('./format-json');
const { Search, Type, Match } = require('masa-search');
const { guid } = require('masa-search/dist/helpers/guid');
const { analyze } = require('./SearchAnalyze');
var moment = require('moment');

const port = 3000;

const testData = require('../test-data/history.copy.json');

const search = new Search();

search.addIndex({
	key: 'title',
	type: Type.TEXT
});

search.addIndex({
	key: 'text',
	type: Type.TEXT
});

search.addIndex({
	key: 'date',
	type: Type.DATE
});

search.addIndex({
	key: 'mood',
	type: Type.NUMBER
});

search.addData(testData);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (request, response) => {
	response.send('Hello from Express!')
});

app.get('/api/history', (request, response) => {
	response.json(testData);
});

app.post('/api/history', (request, response) => {
	const today = new Date();

	const newEntry = {
		id: guid(),
		date: today.getFullYear() + '-' + ('0' + today.getMonth()).slice(-2) + '-' + ('0' + today.getDate()).slice(-2),
		title: request.body.title,
		text: request.body.text,
		mood: Number(request.body.mood)
	};

	testData.push(newEntry);
	search.addData([ newEntry ]);

	fs.writeFile('./test-data/history.copy.json', jsonFormat(testData), (err) => {
		if (err) {
			console.log(err);
			response.status(500).send(err);
		} else {
			response.json(newEntry);
		}
	});
});

app.get('/api/history/search', (request, response) => {
	const value = request.query.query;

	const matchMap = {
		'>': Match.GT,
		'>=': Match.GTE,
		'<': Match.LT,
		'<=': Match.LTE,
		'=': Match.EQ
	};

	const getNumberCondition = (query, field) => {
		const parts = /([<>]?=?)\s*(.*)/.exec(query);

		return {
			index: {
				key: 'mood',
				type: Type.NUMBER
			},
			value: parts[2],
			match: matchMap[parts[1]]
		};
	};

	const getDateCondition = (query, field) => {
		const parts = /([<>]?=?)\s*(.*)/.exec(query);

		return {
			index: {
				key: 'date',
				type: Type.DATE
			},
			value: moment(parts[2], 'DD.MM.YYYY').format('YYYY-MM-DD'),
			match: matchMap[parts[1]]
		};
	};

	const buildSearch = (query) => {
		const search = {
			and: []
		};

		const result = analyze(query);

		if (result.dates) {
			result.dates.forEach(date => {
				search.and.push({
					condition: getDateCondition(date, 'date')
				});
			});
		}

		if (result.numbers) {
			result.numbers.forEach(number => {
				search.and.push({
					condition: getNumberCondition(number, 'mood')
				});
			});
		}

		if (result.words) {
			const ors = result.words.map(word => {
				return {
					or: [{
						condition: {
							index: {
								key: 'title',
								type: Type.WORD
							},
							value: word,
							match: Match.EQ
						},
						condition: {
							index: {
								key: 'text',
								type: Type.WORD
							},
							value: word,
							match: Match.EQ
						}
					}]
				};
			});

			search.and.push({
				or: ors
			});
		}

		return search;
	};

	response.json(search.find(buildSearch(value)));
});

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}

	console.log(`server is listening on ${port}`);
});