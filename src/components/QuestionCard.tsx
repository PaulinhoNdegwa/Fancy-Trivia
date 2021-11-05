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
    <div className="px-5">
        <p className="my-1 font-sans font-normal text-base text-gray-500">Question: {questionNo} / {totalQuestions}</p>
        <p className="rounded-md font-semibold italic text-xl my-3" dangerouslySetInnerHTML={{ __html: question }} />
        <div>
            {
                answers.map(answer => {
                    return (
                        <div className="px-10" key={answer}>
                            <button className={`px-6 py-1 ${userAnswer?.correctAnswer === answer ? `bg-green-500` : null} ${userAnswer?.answer === answer ? 'bg-gray-600' :  "bg-gray-400"} disabled:bg-gray-400 text-black rounded-sm mt-1 w-full font-semibold text-md hover:ring-4 hover:ring-blue-900 hover:ring-opacity-50`} value={answer} disabled={!!userAnswer} onClick={callback}>
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