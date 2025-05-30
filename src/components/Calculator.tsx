
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, RotateCcw } from 'lucide-react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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

  const buttonClass = "h-16 text-lg font-semibold transition-all duration-200 transform hover:scale-105";
  const numberButtonClass = `${buttonClass} bg-white hover:bg-gray-50 text-gray-800 border border-gray-200`;
  const operatorButtonClass = `${buttonClass} bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white`;
  const specialButtonClass = `${buttonClass} bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white`;

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <CalculatorIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Professional Calculator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-gray-900 text-white p-4 rounded-lg text-right text-2xl font-mono overflow-hidden">
          {display}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <Button onClick={clear} className={`${specialButtonClass} col-span-2`}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button onClick={() => performOperation('÷')} className={operatorButtonClass}>
            ÷
          </Button>
          <Button onClick={() => performOperation('×')} className={operatorButtonClass}>
            ×
          </Button>

          {/* Second Row */}
          <Button onClick={() => inputNumber('7')} className={numberButtonClass}>7</Button>
          <Button onClick={() => inputNumber('8')} className={numberButtonClass}>8</Button>
          <Button onClick={() => inputNumber('9')} className={numberButtonClass}>9</Button>
          <Button onClick={() => performOperation('-')} className={operatorButtonClass}>-</Button>

          {/* Third Row */}
          <Button onClick={() => inputNumber('4')} className={numberButtonClass}>4</Button>
          <Button onClick={() => inputNumber('5')} className={numberButtonClass}>5</Button>
          <Button onClick={() => inputNumber('6')} className={numberButtonClass}>6</Button>
          <Button onClick={() => performOperation('+')} className={operatorButtonClass}>+</Button>

          {/* Fourth Row */}
          <Button onClick={() => inputNumber('1')} className={numberButtonClass}>1</Button>
          <Button onClick={() => inputNumber('2')} className={numberButtonClass}>2</Button>
          <Button onClick={() => inputNumber('3')} className={numberButtonClass}>3</Button>
          <Button onClick={calculate} className={`${operatorButtonClass} row-span-2`}>
            =
          </Button>

          {/* Fifth Row */}
          <Button onClick={() => inputNumber('0')} className={`${numberButtonClass} col-span-2`}>
            0
          </Button>
          <Button onClick={inputDecimal} className={numberButtonClass}>.</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
