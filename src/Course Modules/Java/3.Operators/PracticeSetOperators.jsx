import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet'; // Keep this for CodeModal
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';
import Hint from '../../../Frontend/Components/practice compnenets/hint';
import ViewSolution from '../../../Frontend/Components/practice compnenets/viewsolution';

const PracticeSetOperators = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentExample, setCurrentExample] = useState(null);
  const [expandedHints, setExpandedHints] = useState({});
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const toggleSolution = (exerciseKey) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  const toggleHint = (exerciseKey) => {
    setExpandedHints(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  const CodeModal = ({ code, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <span className="sr-only">Close</span>
          ✕
        </button>
        <CodeSnippet
          code={code}
          language="java"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>
    </div>
  );

  const mcqQuestions = [
    {
      id: 1,
      question: "What is the result of 15 / 2 in Java?",
      options: [
        "7.5",
        "7",
        "8",
        "7.0"
      ],
      correctAnswer: 1,
      explanation: "When dividing two integers in Java, the result is truncated to an integer. 15 / 2 = 7.5, but it's truncated to 7."
    },
    {
      id: 2,
      question: "What is the value of x after: int x = 10 % 3;",
      options: [
        "3",
        "1",
        "0",
        "3.33"
      ],
      correctAnswer: 1,
      explanation: "The modulus operator (%) returns the remainder after division. 10 divided by 3 is 3 with remainder 1."
    },
    {
      id: 3,
      question: "What is the output of: System.out.println(10 + 20 + \"Hello\");",
      options: [
        "30Hello",
        "1020Hello",
        "Hello1020",
        "Hello30"
      ],
      correctAnswer: 0,
      explanation: "Operations are performed from left to right. First 10 + 20 = 30, then concatenated with \"Hello\"."
    },
    {
      id: 4,
      question: "What is the result of 5.0 / 2?",
      options: [
        "2.0",
        "2.5",
        "2",
        "2.50"
      ],
      correctAnswer: 1,
      explanation: "When one operand is a floating-point number, the result is also floating-point."
    },
    {
      id: 5,
      question: "Which operator can be used to increment a variable by 1?",
      options: [
        "+",
        "++",
        "+=",
        "Both ++ and +="
      ],
      correctAnswer: 3,
      explanation: "Both ++ (increment operator) and += 1 can be used to increment a variable by 1."
    },
    {
      id: 6,
      question: "What is the value of: 25 % 7?",
      options: [
        "3",
        "4",
        "5",
        "6"
      ],
      correctAnswer: 1,
      explanation: "25 divided by 7 is 3 with remainder 4. The modulus operator returns 4."
    },
    {
      id: 7,
      question: "What happens in: int x = 5 / 2 * 2?",
      options: [
        "x = 4",
        "x = 5",
        "x = 6",
        "x = 2"
      ],
      correctAnswer: 0,
      explanation: "First 5/2 = 2 (integer division), then 2 * 2 = 4."
    },
    {
      id: 8,
      question: "What is the output of: System.out.println(\"Hello\" + 1 + 2);",
      options: [
        "Hello12",
        "Hello3",
        "3Hello",
        "12Hello"
      ],
      correctAnswer: 0,
      explanation: "When string concatenation starts, all subsequent + operations perform concatenation."
    },
    {
      id: 9,
      question: "What is the result of: 10.0 % 3.0?",
      options: [
        "3.0",
        "1.0",
        "0.0",
        "3.33"
      ],
      correctAnswer: 1,
      explanation: "Modulus operator works with floating-point numbers too, returning the remainder 1.0."
    },
    {
      id: 10,
      question: "What is x after: int x = 10; x /= 3;",
      options: [
        "3",
        "3.33",
        "3.0",
        "4"
      ],
      correctAnswer: 0,
      explanation: "x /= 3 is equivalent to x = x / 3. Since x is int, result is truncated to 3."
    },
    {
      id: 11,
      question: "What's the value of: 7 * 3 + 4 / 2?",
      options: [
        "23",
        "24",
        "21",
        "22"
      ],
      correctAnswer: 0,
      explanation: "Following operator precedence: (7 * 3) + (4 / 2) = 21 + 2 = 23"
    },
    {
      id: 12,
      question: "What happens in: double result = 9 / 2;",
      options: [
        "result = 4.5",
        "result = 4.0",
        "result = 4",
        "Compilation error"
      ],
      correctAnswer: 1,
      explanation: "Integer division occurs first (9/2 = 4), then 4 is converted to 4.0 for double assignment."
    },
    {
      id: 13,
      question: "What's the output: System.out.println(15 + -5 * 2);",
      options: [
        "20",
        "5",
        "10",
        "25"
      ],
      correctAnswer: 1,
      explanation: "Multiplication has higher precedence: 15 + (-5 * 2) = 15 + -10 = 5"
    },
    {
      id: 14,
      question: "What's x after: int x = 27; x %= 5;",
      options: [
        "5",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 1,
      explanation: "27 divided by 5 gives quotient 5 and remainder 2. x %= 5 assigns the remainder 2 to x."
    },
    {
      id: 15,
      question: "What's the result of: 10.0 / 0.0?",
      options: [
        "Infinity",
        "Error",
        "NaN",
        "0"
      ],
      correctAnswer: 0,
      explanation: "Division of a positive floating-point number by zero results in Infinity in Java."
    },
    {
      id: 16,
      question: "What's printed: System.out.println(1 + 2 + \"3\" + 4 + 5);",
      options: [
        "3345",
        "6345",
        "12345",
        "3345"
      ],
      correctAnswer: 0,
      explanation: "1+2=3, then \"3\"3 (concatenation), then 34, finally 345"
    },
    {
      id: 17,
      question: "What's the value of: Math.round(5.6)?",
      options: [
        "5",
        "6",
        "5.0",
        "6.0"
      ],
      correctAnswer: 1,
      explanation: "Math.round() returns the nearest integer to the argument."
    },
    {
      id: 18,
      question: "What's x after: int x = 5; x *= 3 + 2;",
      options: [
        "17",
        "25",
        "35",
        "15"
      ],
      correctAnswer: 1,
      explanation: "First 3+2=5, then x *= 5 is equivalent to x = x * 5 = 25"
    },
    {
      id: 19,
      question: "What's the output of: System.out.println(10/3.0);",
      options: [
        "3",
        "3.0",
        "3.33",
        "3.3333333333333335"
      ],
      correctAnswer: 3,
      explanation: "Division with a double operand results in a precise floating-point calculation."
    },
    {
      id: 20,
      question: "What happens in: int x = (int)5.7 + (int)3.3;",
      options: [
        "9",
        "8",
        "8.0",
        "9.0"
      ],
      correctAnswer: 1,
      explanation: "Each floating-point number is truncated before addition: 5 + 3 = 8"
    }
  ];

  const codingExercises = {
    exercise1: {
      title: "Basic Calculator",
      description: "Create a calculator that takes two numbers and performs all basic arithmetic operations (+, -, *, /, %)",
      template: `public class Calculator {
    public static void main(String[] args) {
        double num1 = 10;
        double num2 = 3;
        
        // TODO: Print results of all operations
        // Format output to 2 decimal places
    }
}`,
      solution: `System.out.printf("Addition: %.2f\\n", num1 + num2);
System.out.printf("Subtraction: %.2f\\n", num1 - num2);
System.out.printf("Multiplication: %.2f\\n", num1 * num2);
System.out.printf("Division: %.2f\\n", num1 / num2);
System.out.printf("Modulus: %.2f\\n", num1 % num2);`,
      hint: "Use System.out.printf() with %.2f format specifier for decimal places"
    },
    exercise2: {
      title: "Temperature Converter",
      description: "Write a program to convert temperature from Celsius to Fahrenheit and vice versa. Formula: F = (C × 9/5) + 32",
      template: `public class TemperatureConverter {
    public static void main(String[] args) {
        double celsius = 25;
        // TODO: Convert to Fahrenheit
        // Print both Celsius and Fahrenheit temperatures
    }
}`,
      solution: `double fahrenheit = (celsius * 9/5) + 32;
System.out.printf("%.1f°C = %.1f°F%n", celsius, fahrenheit);

// Convert back to Celsius
double celsiusAgain = (fahrenheit - 32) * 5/9;
System.out.printf("%.1f°F = %.1f°C", fahrenheit, celsiusAgain);`,
      hint: "Remember the formula: F = (C × 9/5) + 32 and use printf for formatting"
    },
    exercise3: {
      title: "Number Properties",
      description: "Create a program that checks if a number is even/odd and positive/negative using arithmetic operators",
      template: `public class NumberProperties {
    public static void main(String[] args) {
        int number = 15;
        // TODO: Check if number is even/odd using %
        // TODO: Check if number is positive/negative
    }
}`,
      solution: `boolean isEven = (number % 2) == 0;
boolean isPositive = number > 0;

System.out.println(number + " is " + (isEven ? "even" : "odd"));
System.out.println(number + " is " + (isPositive ? "positive" : "negative"));`,
      hint: "Use modulus (%) operator for even/odd check and comparison operator for positive/negative"
    },
    exercise4: {
      title: "Grade Calculator",
      description: "Create a program that calculates the average of three test scores and rounds to nearest integer",
      template: `public class GradeCalculator {
    public static void main(String[] args) {
        double test1 = 85.5;
        double test2 = 92.7;
        double test3 = 88.3;
        // TODO: Calculate average and round to nearest integer
    }
}`,
      solution: `double average = (test1 + test2 + test3) / 3;
int roundedAverage = (int) Math.round(average);
System.out.println("Test scores: " + test1 + ", " + test2 + ", " + test3);
System.out.println("Average: " + average);
System.out.println("Rounded average: " + roundedAverage);`,
      hint: "Use Math.round() to round the average to nearest integer"
    },
    exercise5: {
      title: "Time Converter",
      description: "Convert total minutes into hours and remaining minutes using arithmetic operators",
      template: `public class TimeConverter {
    public static void main(String[] args) {
        int totalMinutes = 145;
        // TODO: Convert to hours and minutes
    }
}`,
      solution: `int hours = totalMinutes / 60;
int minutes = totalMinutes % 60;
System.out.println(totalMinutes + " minutes = " + 
    hours + " hours and " + minutes + " minutes");`,
      hint: "Use division (/) for hours and modulus (%) for remaining minutes"
    },
    exercise6: {
      title: "Interest Calculator",
      description: "Create a program that calculates simple interest using the formula: SI = (P × R × T)/100",
      template: `public class InterestCalculator {
    public static void main(String[] args) {
        double principal = 1000;
        double rate = 5.5;
        int time = 2;  // years
        // TODO: Calculate simple interest
    }
}`,
      solution: `double simpleInterest = (principal * rate * time) / 100;
double totalAmount = principal + simpleInterest;
System.out.printf("Simple Interest: $%.2f%n", simpleInterest);
System.out.printf("Total Amount: $%.2f", totalAmount);`,
      hint: "Use the formula SI = (P × R × T)/100 and printf for formatted output"
    },

    exercise7: {
      title: "Circle Calculator",
      description: "Calculate the area and circumference of a circle using operators and Math.PI",
      template: `public class CircleCalculator {
    public static void main(String[] args) {
        double radius = 5.0;
        // TODO: Calculate and print area and circumference
    }
}`,
      solution: `double area = Math.PI * radius * radius;
double circumference = 2 * Math.PI * radius;
System.out.printf("Area: %.2f square units%n", area);
System.out.printf("Circumference: %.2f units", circumference);`,
      hint: "Area = πr², Circumference = 2πr"
    },

    exercise8: {
      title: "Distance Calculator",
      description: "Calculate the distance between two points using the distance formula",
      template: `public class DistanceCalculator {
    public static void main(String[] args) {
        int x1 = 0, y1 = 0;  // Point 1
        int x2 = 3, y2 = 4;  // Point 2
        // TODO: Calculate distance using distance formula
    }
}`,
      solution: `double distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
System.out.printf("Distance between points: %.2f units", distance);`,
      hint: "Use the distance formula: √[(x₂-x₁)² + (y₂-y₁)²]"
    },

    exercise9: {
      title: "Number Swapper",
      description: "Swap two numbers without using a temporary variable (using arithmetic operators)",
      template: `public class NumberSwapper {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        System.out.println("Before swap: a = " + a + ", b = " + b);
        // TODO: Swap numbers using arithmetic operators
    }
}`,
      solution: `a = a + b;
b = a - b;
a = a - b;
System.out.println("After swap: a = " + a + ", b = " + b);`,
      hint: "Use addition and subtraction to swap values"
    },

    exercise10: {
      title: "Bill Calculator",
      description: "Calculate total bill amount including tax and tip",
      template: `public class BillCalculator {
    public static void main(String[] args) {
        double billAmount = 84.50;
        double taxRate = 8.875;  // in percentage
        double tipRate = 15.0;   // in percentage
        // TODO: Calculate total bill including tax and tip
    }
}`,
      solution: `double tax = billAmount * (taxRate / 100);
double subtotalWithTax = billAmount + tax;
double tip = subtotalWithTax * (tipRate / 100);
double totalAmount = subtotalWithTax + tip;

System.out.printf("Bill Amount: $%.2f%n", billAmount);
System.out.printf("Tax (%.2f%%): $%.2f%n", taxRate, tax);
System.out.printf("Subtotal with Tax: $%.2f%n", subtotalWithTax);
System.out.printf("Tip (%.2f%%): $%.2f%n", tipRate, tip);
System.out.printf("Total Amount: $%.2f", totalAmount);`,
      hint: "Calculate tax first, then tip based on subtotal with tax"
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const renderCodingExercises = () => (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-400">Coding Exercises</h2>
      
      {Object.entries(codingExercises).map(([key, exercise]) => (
        <div key={key} className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
          <h3 className="text-xl font-medium text-green-400 mb-3">{exercise.title}</h3>
          <p className="text-gray-300 mb-4">{exercise.description}</p>
          
          <div className="mb-4">
            <CodeEditor defaultCode={exercise.template} />
          </div>

          <ViewSolution 
            solution={exercise.solution}
            isExpanded={expandedSolutions[key]}
            onToggle={() => toggleSolution(key)}
          />

          <Hint 
            hint={exercise.hint}
            isExpanded={expandedHints[key]}
            onToggle={() => toggleHint(key)}
          />
        </div>
      ))}
    </section>
  );

  const tryYourselfQuestions = (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-purple-400">Try It Yourself! 🚀</h2>
      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <p className="text-gray-300 mb-4">
          Challenge yourself with these problems! Try to solve them without looking at solutions:
        </p>
        <ol className="list-decimal list-inside space-y-4 text-gray-300">
          <li>BMI Calculator: Create a program that calculates Body Mass Index using the formula: BMI = weight(kg) / (height(m))²</li>
          <li>Currency Converter: Convert an amount from USD to EUR using the current exchange rate</li>
          <li>Triangle Area: Calculate the area of a triangle using Heron's formula</li>
          <li>Speed Calculator: Calculate average speed given distance and time</li>
          <li>Power Bill: Calculate electricity bill based on units consumed and rate per unit</li>
          <li>Digit Extractor: Extract and display individual digits of a 4-digit number using / and %</li>
          <li>Percentage Calculator: Calculate percentage marks for 5 subjects</li>
          <li>Time Addition: Add two times given in hours and minutes format</li>
          <li>Data Usage: Calculate remaining data in GB given total plan data and used data</li>
          <li>Paint Calculator: Calculate how many paint cans needed for a given wall area</li>
          <li>Investment Growth: Calculate compound value after n years</li>
          <li>Temperature Difference: Find the difference between highest and lowest temperature</li>
          <li>Age Calculator: Calculate age in years, months, and days given birth date</li>
          <li>File Size Converter: Convert file size between MB, GB, and TB</li>
          <li>Fuel Efficiency: Calculate fuel efficiency in km/l and convert to miles/gallon</li>
        </ol>
      </div>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Practice Set: Operators in Java 🎯
      </h1>

      {/* MCQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Multiple Choice Questions</h2>
        {mcqQuestions.map((question) => (
          <MCQ
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id]}
            onAnswerSelect={handleAnswerSelect}
          />
        ))}
      </section>

      {/* Coding Exercises Section */}
      {renderCodingExercises()}

      {/* Add the Try It Yourself section */}
      {tryYourselfQuestions}

      {/* Code Modal */}
      {showCodeModal && createPortal(
        <CodeModal
          code={currentExample}
          onClose={() => setShowCodeModal(false)}
        />,
        document.getElementById('modal-root') || document.body
      )}
    </div>
  );
};

export default PracticeSetOperators;
