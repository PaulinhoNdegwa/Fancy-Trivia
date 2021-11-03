import React from 'react';
import { AnswerObject } from '../App';

type Props = {
    question: string,
    answers: string[],
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void,
    userAnswer: AnswerObject | undefined,
    questionNo: number,
    totalQuestions: number
}
const QuestionCard: React.FC<Props> = ({ question, answers, callback, userAnswer, questionNo, totalQuestions }) => (
    <div>
        <p className="number">Question: {questionNo} / {totalQuestions}</p>
        <p dangerouslySetInnerHTML={{ __html: question }} />
        <div>
            {
                answers.map(answer => {
                    return (
                        <div key={answer}>
                            <button value={answer} disabled={!!userAnswer} onClick={callback}>
                                <span dangerouslySetInnerHTML={{ __html: answer }} />
                            </button>
                        </div>
                    )
                })
            }
        </div>
    </div>
)


export default QuestionCard;