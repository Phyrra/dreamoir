const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFormat = require('./format-json');

const port = 3000;

const testData = require('../test-data/history.copy.json');

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

	testData.push({
		date: today.getFullYear() + '-' + ('0' + today.getMonth()).slice(-2) + '-' + ('0' + today.getDate()).slice(-2),
		title: request.body.title,
		text: request.body.text
	});

	console.log(request.body);

	fs.writeFile('./test-data/history.copy.json', jsonFormat(testData), (err) => {
		if (err) {
			console.log(err);
			response.status(500).send(err);
		} else {
			response.send('OK');
		}
	});
});

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}

	console.log(`server is listening on ${port}`);
});