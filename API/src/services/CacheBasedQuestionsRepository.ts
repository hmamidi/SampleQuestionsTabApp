import { IQuestion } from "../models/IQuestion";
import { IQuestionsRepository } from "./IQuestionsRepository";

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

export class CacheBasedQuestionsRepository implements IQuestionsRepository {
    
    Save(question: IQuestion): boolean {
        return myCache.set(question.QuestionId, question, 10000);
    }

    GetFirstOrDefault(questionId: string): IQuestion {
        return myCache.get(questionId);
    }

    GetQuestions(): IQuestion[] {
        var keys = myCache.keys() as string[];
        var questions = [] as IQuestion[];

        keys.forEach(key => {
            questions.push(myCache.get(key));
        });

        return questions;
    }
}
