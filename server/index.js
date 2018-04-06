const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFormat = require('./format-json');
const guid = require('./guid');
const { Search, Type, Match } = require('./Search');

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

	response.json(search.find({
		or: [
			{
				condition: {
					index: {
						key: 'title',
						type: Type.TEXT
					},
					value: value
				}
			}, {
				condition: {
					index: {
						key: 'text',
						type: Type.TEXT
					},
					value: value
				}
			}
		]
	}));
});

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}

	console.log(`server is listening on ${port}`);
});