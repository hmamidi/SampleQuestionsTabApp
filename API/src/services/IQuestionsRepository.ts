import { IQuestion } from "../models/IQuestion";

export interface IQuestionsRepository
{
    Save(question: IQuestion): boolean;
    GetFirstOrDefault(questionId: string): IQuestion;
    GetQuestions(): IQuestion[];
}

