import express from 'express';

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const port=process.env.PORT || 8000

const app = express();

app.use(express.json());

app.get('/questions/all', (req, res) => {
    res.send([]);
});

app.post('/question', (req, res) => {
    res.send(JSON.stringify(req.body));
});

app.post('/question/{qid}/answer', (req, res) => {
    res.send({});
});

app.post('/question/{qid}/{user}', (req, res) => {
    res.send({});
});

app.listen(port, () => {
    console.log('The application is listening on port 8000!');
});