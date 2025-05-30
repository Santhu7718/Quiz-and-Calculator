
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, RotateCcw, Divide, X, Minus, Plus, Equal } from 'lucide-react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = currentValue;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '=':
          result = inputValue;
          break;
        default:
          return;
      }

      // Add to history if it's a calculation
      if (operation !== '=' && nextOperation === '=') {
        const calculation = `${currentValue} ${operation} ${inputValue} = ${result}`;
        setHistory(prev => [calculation, ...prev.slice(0, 4)]); // Keep last 5 calculations
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation('=');
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const buttonClass = "h-16 text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95";
  const numberButtonClass = `${buttonClass} bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md`;
  const operatorButtonClass = `${buttonClass} bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl`;
  const specialButtonClass = `${buttonClass} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl`;
  const equalsButtonClass = `${buttonClass} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl`;

  return (
    <div className="flex gap-6 max-w-6xl">
      {/* Calculator */}
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg">
              <CalculatorIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Pro Calculator
          </CardTitle>
          <div className="text-sm text-gray-500 space-y-1">
            <div>Full-featured mathematical operations</div>
            <div className="text-xs">• State management • Event handling • UI design</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Enhanced Display */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-inner">
            <div className="text-right space-y-2">
              {operation && previousValue !== null && (
                <div className="text-sm text-gray-400 font-mono">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-3xl font-mono overflow-hidden break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* First Row */}
            <Button onClick={clear} className={`${specialButtonClass} col-span-2`}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button onClick={() => performOperation('÷')} className={operatorButtonClass}>
              <Divide className="w-4 h-4" />
            </Button>
            <Button onClick={() => performOperation('×')} className={operatorButtonClass}>
              <X className="w-4 h-4" />
            </Button>

            {/* Number Rows */}
            <Button onClick={() => inputNumber('7')} className={numberButtonClass}>7</Button>
            <Button onClick={() => inputNumber('8')} className={numberButtonClass}>8</Button>
            <Button onClick={() => inputNumber('9')} className={numberButtonClass}>9</Button>
            <Button onClick={() => performOperation('-')} className={operatorButtonClass}>
              <Minus className="w-4 h-4" />
            </Button>

            <Button onClick={() => inputNumber('4')} className={numberButtonClass}>4</Button>
            <Button onClick={() => inputNumber('5')} className={numberButtonClass}>5</Button>
            <Button onClick={() => inputNumber('6')} className={numberButtonClass}>6</Button>
            <Button onClick={() => performOperation('+')} className={operatorButtonClass}>
              <Plus className="w-4 h-4" />
            </Button>

            <Button onClick={() => inputNumber('1')} className={numberButtonClass}>1</Button>
            <Button onClick={() => inputNumber('2')} className={numberButtonClass}>2</Button>
            <Button onClick={() => inputNumber('3')} className={numberButtonClass}>3</Button>
            <Button onClick={calculate} className={`${equalsButtonClass} row-span-2`}>
              <Equal className="w-5 h-5" />
            </Button>

            <Button onClick={() => inputNumber('0')} className={`${numberButtonClass} col-span-2`}>
              0
            </Button>
            <Button onClick={inputDecimal} className={numberButtonClass}>.</Button>
          </div>

          {/* Calculator Info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="font-medium">Technical Features Demonstrated:</div>
              <div className="flex justify-center gap-4 text-xs">
                <span>• State Management</span>
                <span>• Event Handling</span>
                <span>• UI Components</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Panel */}
      <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800">
              Calculation History
            </CardTitle>
            {history.length > 0 && (
              <Button 
                onClick={clearHistory}
                variant="outline" 
                size="sm"
                className="text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Recent calculations automatically saved
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CalculatorIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <div className="text-sm">No calculations yet</div>
              <div className="text-xs">Start calculating to see history</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((calc, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg font-mono text-sm transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-sm' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {calc}
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="font-medium">Development Skills:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded text-blue-700">React Hooks</div>
                <div className="bg-green-50 p-2 rounded text-green-700">TypeScript</div>
                <div className="bg-purple-50 p-2 rounded text-purple-700">State Logic</div>
                <div className="bg-orange-50 p-2 rounded text-orange-700">UI Design</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
