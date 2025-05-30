
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RotateCcw, Code, Zap, Target, Calculator as CalculatorIcon, BookOpen, Clock, Star, Award, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Calculator from '@/components/Calculator';

// Enhanced quiz data with more detailed questions and explanations
const quizQuestions = [
  {
    id: 1,
    question: "What is the correct way to declare a variable in modern JavaScript?",
    options: ["var name = 'John'", "let name = 'John'", "const name = 'John'", "Both let and const"],
    correct: 3,
    explanation: "Both 'let' and 'const' are modern ways to declare variables introduced in ES6. Use 'const' for values that won't change, 'let' for variables that will be reassigned. Avoid 'var' due to hoisting and scope issues.",
    category: "ES6 Variables",
    difficulty: "Beginner",
    points: 10
  },
  {
    id: 2,
    question: "Which method is used to add an event listener to a DOM element?",
    options: ["element.addEvent()", "element.addEventListener()", "element.on()", "element.bind()"],
    correct: 1,
    explanation: "addEventListener() is the standard W3C method to attach event handlers to DOM elements. It allows multiple listeners for the same event and provides better control over event propagation.",
    category: "DOM Events",
    difficulty: "Intermediate",
    points: 15
  },
  {
    id: 3,
    question: "What does DOM stand for and what is its primary purpose?",
    options: ["Data Object Model", "Document Object Model", "Dynamic Object Management", "Display Object Method"],
    correct: 1,
    explanation: "DOM stands for Document Object Model - it's a programming interface that represents HTML/XML documents as a tree structure, allowing JavaScript to dynamically modify content, structure, and styling.",
    category: "DOM Fundamentals",
    difficulty: "Beginner",
    points: 10
  },
  {
    id: 4,
    question: "Which CSS property provides the best performance for animations?",
    options: ["margin", "left/top", "transform", "width/height"],
    correct: 2,
    explanation: "The 'transform' property is hardware-accelerated by the GPU and doesn't trigger layout recalculations, making it perfect for smooth 60fps animations. Properties like margin, left/top trigger expensive reflows.",
    category: "Performance & Animations",
    difficulty: "Advanced",
    points: 20
  },
  {
    id: 5,
    question: "What's the most efficient way to handle asynchronous operations in modern JavaScript?",
    options: ["Nested callbacks", "Promise chains", "async/await", "setTimeout loops"],
    correct: 2,
    explanation: "async/await provides the cleanest, most readable syntax for handling asynchronous operations. It's built on Promises but eliminates callback hell and makes error handling with try/catch more intuitive.",
    category: "Async Programming",
    difficulty: "Advanced",
    points: 20
  },
  {
    id: 6,
    question: "Which array method should you use to transform each element and return a new array?",
    options: ["forEach()", "map()", "filter()", "reduce()"],
    correct: 1,
    explanation: "map() creates a new array with the results of calling a function on every element. It's functional, immutable, and perfect for data transformation without mutating the original array.",
    category: "Array Methods",
    difficulty: "Intermediate",
    points: 15
  },
  {
    id: 7,
    question: "What is event delegation and why is it useful?",
    options: ["Passing events between components", "Attaching listeners to parent elements", "Creating custom events", "Preventing event bubbling"],
    correct: 1,
    explanation: "Event delegation involves attaching a single event listener to a parent element to handle events from child elements using event bubbling. It's memory-efficient and works with dynamically added elements.",
    category: "Advanced DOM",
    difficulty: "Advanced",
    points: 20
  }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'calculator'>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const maxPossiblePoints = quizQuestions.reduce((sum, q) => sum + q.points, 0);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0 && !isAnswered) {
      handleAnswerSelect(-1); // Auto-submit as wrong answer
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive, isAnswered]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setTimerActive(false);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (answerIndex === question.correct) {
      const points = question.points + (timeRemaining > 20 ? 5 : timeRemaining > 10 ? 3 : 1); // Time bonus
      setScore(score + 1);
      setTotalPoints(totalPoints + points);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      
      toast.success(`Correct! +${points} points! 🎉`, {
        description: `${question.explanation}${timeRemaining > 20 ? ' • Speed bonus!' : ''}`,
      });
    } else {
      setStreak(0);
      if (answerIndex === -1) {
        toast.error("Time's up! ⏰", {
          description: question.explanation,
        });
      } else {
        toast.error("Not quite right 💭", {
          description: question.explanation,
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeRemaining(30);
      setTimerActive(true);
    } else {
      setShowResult(true);
      setTimerActive(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTotalPoints(0);
    setShowResult(false);
    setIsAnswered(false);
    setUserAnswers([]);
    setQuizStarted(false);
    setTimeRemaining(30);
    setTimerActive(false);
    setStreak(0);
    setMaxStreak(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 85) return "🚀 Outstanding! You're ready for senior roles!";
    if (percentage >= 70) return "💪 Excellent! Strong technical foundation!";
    if (percentage >= 55) return "📚 Good progress! Keep building those skills!";
    return "🎯 Keep learning! Every expert was once a beginner!";
  };

  const getPerformanceLevel = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 85) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-50" };
    if (percentage >= 70) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 55) return { level: "Intermediate", color: "text-green-600", bg: "bg-green-50" };
    return { level: "Beginner", color: "text-orange-600", bg: "bg-orange-50" };
  };

  if (currentView === 'calculator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-6">
          <div className="text-center space-y-4">
            <Button 
              onClick={() => setCurrentView('home')}
              variant="outline"
              className="mb-4 hover:scale-105 transition-transform"
            >
              ← Back to Portfolio
            </Button>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Professional Calculator
              </h1>
              <p className="text-gray-600">Demonstrating mathematical operations, state management, and responsive design</p>
            </div>
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
        <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentView('home')}
                variant="outline"
                className="mb-4 hover:scale-105 transition-transform"
              >
                ← Back to Portfolio
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse">
                <Code className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                JavaScript Mastery Quiz
              </CardTitle>
              <p className="text-lg text-gray-600 mb-6">
                Advanced technical assessment for web development roles
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  30s per question
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Points system
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Speed bonuses
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-purple-800">{quizQuestions.length} Questions</span>
                <span className="text-xs text-purple-600">Technical depth</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Zap className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-blue-800">Interactive</span>
                <span className="text-xs text-blue-600">Real-time feedback</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <Trophy className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-indigo-800">Professional</span>
                <span className="text-xs text-indigo-600">Industry standards</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Award className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-green-800">Certified</span>
                <span className="text-xs text-green-600">Skill validation</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Quiz Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Timed challenges with speed bonuses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Multiple difficulty levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Detailed explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Performance analytics</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <Button 
              onClick={() => {
                setQuizStarted(true);
                setTimerActive(true);
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group"
            >
              Begin Assessment
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'quiz' && showResult) {
    const performance = getPerformanceLevel();
    const accuracy = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Assessment Complete!
            </CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{score}/{quizQuestions.length}</div>
                <div className="text-sm text-purple-700">Questions Correct</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
                <div className="text-sm text-blue-700">Total Points</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                <div className="text-sm text-orange-700">Best Streak</div>
              </div>
            </div>

            <div className={`inline-flex items-center px-4 py-2 rounded-full ${performance.bg}`}>
              <Award className={`w-5 h-5 mr-2 ${performance.color}`} />
              <span className={`font-semibold ${performance.color}`}>{performance.level} Level</span>
            </div>
            
            <p className="text-lg text-gray-600 font-medium">
              {getScoreMessage()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Detailed Performance Review</h3>
              {quizQuestions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{q.category}</Badge>
                      <Badge 
                        variant={q.difficulty === 'Beginner' ? 'secondary' : q.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {q.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{q.points} pts</Badge>
                    </div>
                    {userAnswers[index] === q.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium text-sm mb-3">{q.question}</p>
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="font-medium text-green-700">Correct:</span> {q.options[q.correct]}
                    </div>
                    {userAnswers[index] !== q.correct && userAnswers[index] !== -1 && (
                      <div className="text-xs">
                        <span className="font-medium text-red-700">Your answer:</span> {q.options[userAnswers[index]]}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 italic">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={resetQuiz}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:scale-105 transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
              <Button 
                onClick={() => setCurrentView('home')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all"
              >
                Back to Portfolio
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
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => {
                  resetQuiz();
                  setCurrentView('home');
                }}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                ← Portfolio
              </Button>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm font-medium">
                  {question.category}
                </Badge>
                <Badge 
                  variant={question.difficulty === 'Beginner' ? 'secondary' : question.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {question.difficulty}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 font-medium">
                  {currentQuestion + 1} of {quizQuestions.length}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-3 h-3" />
                  <span className={timeRemaining <= 10 ? 'text-red-500 font-bold' : 'text-gray-600'}>
                    {timeRemaining}s
                  </span>
                </div>
              </div>
            </div>
            
            <Progress value={progress} className="w-full h-3 bg-gray-200" />
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Points: {totalPoints}</span>
                {streak > 0 && (
                  <span className="flex items-center gap-1 text-orange-600">
                    🔥 {streak} streak
                  </span>
                )}
              </div>
              <span>{question.points} points available</span>
            </div>
            
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
                        ? 'border-green-500 bg-green-50 text-green-800 shadow-md'
                        : 'border-red-500 bg-red-50 text-red-800 shadow-md'
                      : isAnswered && index === question.correct
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md'
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
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 group"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enhanced Home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse">
              <Code className="w-12 h-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              JavaScript Portfolio
            </CardTitle>
            <p className="text-xl text-gray-600 mb-2">
              Professional Web Development Showcase
            </p>
            <p className="text-sm text-gray-500">
              Demonstrating modern JavaScript, React, TypeScript, and UI/UX skills
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
              <Target className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-purple-800">DOM Expert</span>
              <span className="text-xs text-purple-600 text-center">Dynamic manipulation</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
              <Zap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-blue-800">Event Master</span>
              <span className="text-xs text-blue-600 text-center">Interactive handlers</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
              <Trophy className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-indigo-800">UI/UX Pro</span>
              <span className="text-xs text-indigo-600 text-center">Modern design</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
              <Star className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-green-800">Performance</span>
              <span className="text-xs text-green-600 text-center">Optimized code</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-purple-500 rounded-full group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-300">Featured</Badge>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">Advanced JavaScript Quiz</h3>
                  <p className="text-purple-600 mb-4">
                    Comprehensive technical assessment featuring DOM manipulation, event handling, 
                    async programming, and modern ES6+ concepts with real-time scoring and detailed feedback.
                  </p>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>7 progressive difficulty questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Timed challenges with speed bonuses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Performance analytics & detailed explanations</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentView('quiz')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white group-hover:shadow-lg transition-all"
                >
                  Start Technical Assessment
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500 rounded-full group-hover:scale-110 transition-transform">
                    <CalculatorIcon className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">Interactive</Badge>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">Professional Calculator</h3>
                  <p className="text-blue-600 mb-4">
                    Fully functional calculator demonstrating state management, mathematical operations, 
                    event handling, and responsive design principles with modern UI components.
                  </p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Complete mathematical operations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Professional UI with hover effects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Responsive design & accessibility</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentView('calculator')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all"
                >
                  Open Calculator App
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Technical Skills Demonstrated
              </h3>
              <p className="text-gray-600">Modern web development technologies and best practices</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JS</span>
                </div>
                <div className="font-semibold text-gray-800">JavaScript ES6+</div>
                <div className="text-xs text-gray-600">Modern syntax & features</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TS</span>
                </div>
                <div className="font-semibold text-gray-800">TypeScript</div>
                <div className="text-xs text-gray-600">Type-safe development</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚛</span>
                </div>
                <div className="font-semibold text-gray-800">React</div>
                <div className="text-xs text-gray-600">Component architecture</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white font-bold text-lg">UI</span>
                </div>
                <div className="font-semibold text-gray-800">UI/UX</div>
                <div className="text-xs text-gray-600">Modern design principles</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
