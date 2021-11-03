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
    <div className="App">
      <h1>Awesome Trivia</h1>
      {
        gameOver || userAnswers.length === TOTAL_QUESTIONS ?
          <button className="start" onClick={startTrivia}>Start</button>
          : null
      }
      {!gameOver ? <p className="score">Score: {score} </p> : null}
      {loading && <p>Loading questions ...</p>}
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
          <button className="next" onClick={nextQuestion}>Next Question</button>
        ) : null
      }
    </div>
  );
}

export default App;
