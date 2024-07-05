"use client"

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Question } from "@prisma/client";
import Link from "next/link";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface QuizCardProps {
  questions: Question[];
  onQuizComplete: () => void; // Callback when quiz is complete
}

const QuizCard = ({ questions, onQuizComplete }: QuizCardProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]); // Array to store correct/incorrect answers
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const confetti = useConfettiStore();

  useEffect(() => {
    console.log(questions); // Log questions to see if they are loaded correctly
  }, [questions]);

  const handleAnswerSelection = (option: string) => {
    setSelectedAnswer(option);
  };

  const submitAnswer = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
      setAnswers((prevAnswers) => [...prevAnswers, isCorrect]);
      setIsSubmitted(true);
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null); // Reset selected answer for next question
      setIsSubmitted(false); // Reset submission state
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = () => {
    setIsSubmitted(true); // Mark quiz as fully submitted
    setQuizDone(true); // Quiz is now complete
    confetti.onOpen();
  };

  const checkAnswer = (question: Question, answer: string) => {
    return question.answer === answer;
  };

  const renderQuestion = (question: Question) => {
    const isCorrect = answers[currentQuestionIndex] === true;
    const isIncorrect = answers[currentQuestionIndex] === false;

    return (
      <div key={question.id} className="mt-4">
        <p className="font-medium text-lg text-black">{question.text}</p>
        {question.type === "MCQ" && (
          <div className="mt-2">
            {["option1", "option2", "option3", "option4"].map((optionKey) => {
              const option = question[optionKey as keyof Question];
              return (
                option && (
                  <div
                    key={optionKey}
                    className={`flex text-black items-center cursor-pointer mt-1 p-2 rounded-md ${
                      selectedAnswer === option ? "bg-gray-200" : "bg-white"
                    }`}
                    onClick={() => isSubmitted ? '' : handleAnswerSelection(option.toString())}
                  >
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 mr-2 text-black"
                      checked={selectedAnswer === option}
                      onChange={() => handleAnswerSelection(option.toString())}
                      disabled={isSubmitted}
                    />
                    <span>{option.toString()}</span>
                    {isSubmitted && selectedAnswer === option && (
                      <div className="ml-auto">
                        {isCorrect && <FaCheckCircle size={20} color="#0cde0c" />}
                        {isIncorrect && <FaTimesCircle size={20} color="#de3c3c" />}
                      </div>
                    )}
                  </div>
                )
              );
            })}
          </div>
        )}
        {question.type === "NORMAL" && (
          <div className="flex items-center mt-2">
            <input
              type="text"
              className={`border border-gray-300 rounded-md p-2 w-full text-black ${isSubmitted && checkAnswer(question, selectedAnswer || '') ? 'border-green-500' : 'border-red-500'}`}
              placeholder="Enter your answer"
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isSubmitted}
            />
            {isSubmitted && (
              <span className={`ml-2 text-sm ${checkAnswer(question, selectedAnswer || '') ? 'text-green-500' : 'text-red-500'}`}>
                {checkAnswer(question, selectedAnswer || '') ? <FaCheckCircle size={20} color="#0cde0c" /> : <FaTimesCircle size={20} color="#de3c3c" />}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const progressValue = (currentQuestionIndex + 1) / questions.length * 100;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md max-w-lg mx-auto min-h-[450px] w-full md:w-3/4 lg:w-1/2">
      {!quizDone && (
        <>
          <Progress value={progressValue} className="w-full mb-4" />
          {questions.length > 0 && renderQuestion(questions[currentQuestionIndex])}
          {isSubmitted ? (
            <Button
              onClick={handleNextQuestion}
              variant="default"
              className="mt-4 w-full"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          ) : (
            <Button
              onClick={submitAnswer}
              variant="default"
              className="mt-4 w-full"
              disabled={!selectedAnswer} // Disable button until answer is selected
            >
              Submit
            </Button>
          )}
        </>
      )}
      {quizDone && (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl text-black font-bold mb-4">Quiz Result</h2>
          <p className="text-2xl text-black mt-4">{score}/{questions.length} Questions Correct!</p>
          <Link href="" onClick={onQuizComplete} className="mt-8">
            <Button variant="default">Back to Video</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuizCard;