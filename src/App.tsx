import React, { useState } from 'react';
import { fetchQuizQuestions, Difficulty, QuestionState } from './api';
import QuestionCard from './components/QuestionCard';

export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
}
const TOTAL_QUESTIONS = 3;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questionNo, setQuestionNo] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQuestionNo(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Get user answer
      const answer = e.currentTarget.value;
      // check user answer against correct answer
      const correct = questions[questionNo].correct_answer === answer;
      //  Increment score if score is correct
      if (correct) setScore(prev => prev + 1);
      // Save answer to userAnswers
      const answerObject = {
        question: questions[questionNo].question,
        correct,
        answer,
        correctAnswer: questions[questionNo].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    // Move to next question if not last question
    const nextQuestion = questionNo + 1;
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    } else {
      setQuestionNo(nextQuestion)
    }
  }

  return (
    <div className="main h-screen text-center pt-20">
      <div className="container mx-auto w-1/2 bg-blue-100 text-center px-30 py-20">
      <h1 className="text-3xl font-semibold text-blue-600 ">Awesome Trivia - <span className="text-xl font-semibold">Have fun and learn</span></h1>
      {
        gameOver || userAnswers.length === TOTAL_QUESTIONS ?
          <button className="px-6 py-1.5 bg-blue-600 text-white rounded mt-5 font-medium text-md" onClick={startTrivia}>Start {userAnswers.length === TOTAL_QUESTIONS ? "Again" : null}</button>
          : null
      }
      {!gameOver ? <p className={` text-2xl my-2 ${userAnswers.length === TOTAL_QUESTIONS ? 'text-red-500' : 'text-blue-500 ' }`}> {userAnswers.length === TOTAL_QUESTIONS ? "Final Score: " : 'Score: '} {score} </p> : null}
      {loading && <p className="inline px-7 py-1.5 mt-3 rounded-sm text-base font-semibold italic bg-gradient-to-r from-blue-400 via-pink-500 to-red-400">Loading {userAnswers.length === TOTAL_QUESTIONS ? "more" : null} questions ...</p>}
      {!loading && !gameOver &&
        (<QuestionCard
          questionNo={questionNo + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[questionNo].question}
          answers={questions[questionNo].answers}
          userAnswer={userAnswers ? userAnswers[questionNo] : undefined}
          callback={checkAnswer}
        />)
      }
      {
        !gameOver && !loading && userAnswers.length === questionNo + 1 && questionNo !== TOTAL_QUESTIONS - 1 ? (
          <button className="px-6 py-1.5 bg-blue-600 text-white rounded mt-5 font-medium text-md" onClick={nextQuestion}>Next Question</button>
        ) : null
      }
      <p className="mt-4 text-lg italic font-semibold text-red-500">{!loading && userAnswers.length === TOTAL_QUESTIONS ? "Yaay!! Quiz Over!" : null}</p>
    </div>
    </div>
  );
}

export default App;
