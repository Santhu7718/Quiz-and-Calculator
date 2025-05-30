import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RotateCcw, Code, Zap, Target, Calculator as CalculatorIcon, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import Calculator from '@/components/Calculator';

// Quiz data showcasing JavaScript concepts
const quizQuestions = [
  {
    id: 1,
    question: "What is the correct way to declare a variable in modern JavaScript?",
    options: ["var name = 'John'", "let name = 'John'", "const name = 'John'", "Both let and const"],
    correct: 3,
    explanation: "Both 'let' and 'const' are modern ways to declare variables. Use 'const' for values that won't change, 'let' for variables that will be reassigned.",
    category: "Variables"
  },
  {
    id: 2,
    question: "Which method is used to add an event listener to a DOM element?",
    options: ["element.addEvent()", "element.addEventListener()", "element.on()", "element.bind()"],
    correct: 1,
    explanation: "addEventListener() is the standard method to attach event handlers to DOM elements in JavaScript.",
    category: "DOM Events"
  },
  {
    id: 3,
    question: "What does DOM stand for?",
    options: ["Data Object Model", "Document Object Model", "Dynamic Object Management", "Display Object Method"],
    correct: 1,
    explanation: "DOM stands for Document Object Model - it's the programming interface for HTML documents.",
    category: "DOM Basics"
  },
  {
    id: 4,
    question: "Which CSS property is commonly animated for smooth transitions?",
    options: ["display", "position", "transform", "float"],
    correct: 2,
    explanation: "The 'transform' property is hardware-accelerated and perfect for smooth animations without affecting layout.",
    category: "Animations"
  },
  {
    id: 5,
    question: "What's the best practice for handling asynchronous operations in modern JavaScript?",
    options: ["Callbacks only", "Promises", "async/await", "setTimeout chains"],
    correct: 2,
    explanation: "async/await provides the cleanest syntax for handling asynchronous operations and is built on top of Promises.",
    category: "Async Programming"
  }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'calculator'>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (answerIndex === question.correct) {
      setScore(score + 1);
      toast.success("Correct! Well done! 🎉", {
        description: question.explanation,
      });
    } else {
      toast.error("Not quite right", {
        description: question.explanation,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setUserAnswers([]);
    setQuizStarted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Outstanding! You're ready for that internship! 🚀";
    if (percentage >= 60) return "Great job! You have solid fundamentals! 💪";
    if (percentage >= 40) return "Good effort! Keep practicing! 📚";
    return "Don't give up! Review the concepts and try again! 🎯";
  };

  if (currentView === 'calculator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <Button 
              onClick={() => setCurrentView('home')}
              variant="outline"
              className="mb-4"
            >
              ← Back to Home
            </Button>
          </div>
          <div className="flex justify-center">
            <Calculator />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz' && !quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentView('home')}
                variant="outline"
                className="mb-4"
              >
                ← Back to Home
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <Code className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                JavaScript Quiz Adventure
              </CardTitle>
              <p className="text-lg text-gray-600">
                Test your JavaScript knowledge and showcase your skills!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center justify-center space-x-2 p-4 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-purple-800">5 Questions</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-blue-800">Interactive</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-4 bg-indigo-50 rounded-lg">
                <Trophy className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-indigo-800">Professional</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              onClick={() => setQuizStarted(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Quiz Adventure
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'quiz' && showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Quiz Complete!
            </CardTitle>
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {score}/{quizQuestions.length}
            </div>
            <p className="text-lg text-gray-600 font-medium">
              {getScoreMessage()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Review Your Answers</h3>
              {quizQuestions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg border bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="mb-2">{q.category}</Badge>
                    {userAnswers[index] === q.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium text-sm mb-2">{q.question}</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Correct answer:</span> {q.options[q.correct]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={resetQuiz}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => setCurrentView('home')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => {
                  resetQuiz();
                  setCurrentView('home');
                }}
                variant="outline"
                size="sm"
              >
                ← Home
              </Button>
              <Badge variant="outline" className="text-sm font-medium">
                {question.category}
              </Badge>
              <span className="text-sm text-gray-500 font-medium">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full h-3 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out" />
            </Progress>
            <CardTitle className="text-xl font-bold text-gray-800 leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswer === index
                      ? index === question.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : isAnswered && index === question.correct
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isAnswered && selectedAnswer === index && (
                      index === question.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                    {isAnswered && selectedAnswer !== index && index === question.correct && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {isAnswered && (
              <div className="mt-6 flex justify-center animate-fade-in">
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Code className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Web Development Showcase
            </CardTitle>
            <p className="text-lg text-gray-600">
              Professional JavaScript Applications - Internship Portfolio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center justify-center space-x-2 p-4 bg-purple-50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-purple-800">DOM Manipulation</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-blue-800">Event Handling</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-indigo-50 rounded-lg">
              <Trophy className="w-6 h-6 text-indigo-600" />
              <span className="font-semibold text-indigo-800">Interactivity</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center pb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800">JavaScript Quiz</h3>
                <p className="text-purple-600 text-center">
                  Interactive quiz demonstrating DOM manipulation, event handling, and dynamic content updates.
                </p>
                <Button 
                  onClick={() => setCurrentView('quiz')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Take Quiz
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <CalculatorIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Calculator</h3>
                <p className="text-blue-600 text-center">
                  Professional calculator showcasing mathematical operations, state management, and user interactions.
                </p>
                <Button 
                  onClick={() => setCurrentView('calculator')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open Calculator
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
