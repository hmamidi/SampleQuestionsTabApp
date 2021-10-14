import { IAnswer } from "./IAnswer";

export interface IQuestion
{
    questionId: string;
    questDesc: string;
    user: string;
    upvotedBy: string[];
    timeStamp: Date;
    answers: IAnswer[];
}


