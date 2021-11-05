import React, { useState } from 'react';
import { fetchQuizQuestions, Difficulty, QuestionState } from './api';
import QuestionCard from './components/QuestionCard';

export type AnswerObject = {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
}
const TOTAL_QUESTIONS = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questionNo, setQuestionNo] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [error, setError] = useState(null);

  const startTrivia = async () => {
    setLoading(true);
    setError(null)
    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );

      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setQuestionNo(0);
      setGameOver(false);
      setLoading(false);
    } catch (error: any) {
      // alert(error.message);
      setError(error.message);
      setLoading(false);
      setGameOver(false);
    }

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
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setQuestionNo(nextQuestion)
    }
  }

  return (
    <div className="main h-screen text-center pt-20">
      <div className="container mx-auto w-1/2 bg-blue-100 text-center px-30 py-20 border-2 border-blue-300">
        <h1 className="text-3xl font-semibold text-blue-600 ">Awesome Trivia - <span className="text-xl font-semibold">Have fun and learn</span></h1>
        <hr />
        {
          gameOver || userAnswers.length === TOTAL_QUESTIONS || error ?
            <button className="px-6 py-1.5 bg-blue-600 text-white rounded mt-5 mb-3 font-medium text-md" onClick={startTrivia}>Start {userAnswers.length === TOTAL_QUESTIONS || error ? "Again" : null}</button>
            : null
        }
        <p />
        {!gameOver && !loading && !error ? <p className={` text-2xl mb-2 ${userAnswers.length === TOTAL_QUESTIONS ? 'text-red-500' : 'text-blue-500 '}`}> {userAnswers.length === TOTAL_QUESTIONS ? "Final Score: " : 'Score: '} {score} </p> : null}
        {loading &&
          <div className="mt-3">
            <p className="inline px-7 py-1.5 rounded-sm text-base font-semibold italic bg-gradient-to-r from-blue-400 via-pink-500 to-red-400">Loading {userAnswers.length === TOTAL_QUESTIONS ? "more" : null} questions ...</p>
          </div>
        }
        {error ? (
          <div>
            <p className="w-max mx-auto px-3 py-1.5 mt-4 bg-red-500 font-medium text-white rounded">
              Oops! Error getting quiz questions. Please try again
            </p>
          </div>
        ) : (
          !loading && !gameOver &&
          (
            <QuestionCard
              questionNo={questionNo + 1}
              totalQuestions={TOTAL_QUESTIONS}
              question={questions[questionNo].question}
              answers={questions[questionNo].answers}
              userAnswer={userAnswers ? userAnswers[questionNo] : undefined}
              callback={checkAnswer}
            />
          )
        )
        }
        {
          !gameOver && !loading && userAnswers.length === questionNo + 1 && questionNo !== TOTAL_QUESTIONS - 1 ? (
            <button className="px-6 py-1.5 bg-blue-600 text-white rounded mt-5 font-medium text-md" onClick={nextQuestion}>Next Question</button>
          ) : null
        }
        <p className="mt-4 text-lg italic font-semibold text-red-500">{!loading && userAnswers.length === TOTAL_QUESTIONS && !error ? "Yaay!! Quiz Over!" : null}</p>
      </div>
    </div>
  );
}

export default App;
