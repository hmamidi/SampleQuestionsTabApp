import express from 'express';
import { IAnswer } from './models/IAnswer';
import { IQuestion } from './models/IQuestion';
import { CacheBasedQuestionsRepository } from './services/CacheBasedQuestionsRepository';
import { IQuestionsRepository } from './services/IQuestionsRepository';
import { Guid } from './utilities';

const port=process.env.PORT || 8001

const app = express();
const repo: IQuestionsRepository =  new CacheBasedQuestionsRepository();

app.use(express.json());

app.get('/questions/all', (req, res) => {
    res.send(repo.GetQuestions());
});

app.post('/question', (req, res) => {
    
    var question = req.body as IQuestion;
    question.QuestionId = Guid.newGuid();
    question.Answers = [];
    question.Upvotedby = [];
    question.Timestamp = new Date();

    repo.Save(question);

    res.send(JSON.stringify(question));
});

app.post('/question/:qid/answer', (req, res) => {

    var question = repo.GetFirstOrDefault(req.params.qid);
    var answer = req.body as IAnswer;

    answer.Timestamp = new Date();
    question.Answers.push(answer);

    repo.Save(question);

    res.send(question);
});

app.post('/question/:qid/upvote/:user', (req, res) => {
    var question = repo.GetFirstOrDefault(req.params.qid);
    question.Upvotedby.push(req.params.user);

    repo.Save(question);

    res.send(question);
});

app.listen(port, () => {
    console.log('The application is listening on port 8000!');
});