import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';
import Hint from '../../../Frontend/Components/practice compnenets/hint';
import ViewSolution from '../../../Frontend/Components/practice compnenets/viewsolution';

const PracticeSetForLoops = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [expandedHints, setExpandedHints] = useState({});
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const mcqQuestions = [
    {
      id: 1,
      question: "What will be the output of: for(int i=1; i<=5; i++) { if(i==3) continue; System.out.print(i); }",
      options: ["12345", "1245", "1234", "1235"],
      correctAnswer: 1,
      explanation: "The continue statement skips iteration when i=3"
    },
    {
      id: 2,
      question: "In a nested loop, how many times will the inner loop execute for outer loop iterations of 5?",
      options: ["5 times total", "25 times total", "5 times per outer iteration", "Depends on inner loop condition"],
      correctAnswer: 3,
      explanation: "The total executions depend on both outer and inner loop conditions"
    },
    {
      id: 3,
      question: "What's the output of: for(int i=0; i<3; i++) for(int j=0; j<2; j++) System.out.print(i+j+' ');",
      options: ["0 1 1 2 2 3", "0 1 2 3 4 5", "0 2 4", "1 2 3"],
      correctAnswer: 0,
      explanation: "For each i, j runs from 0 to 1, adding i+j each time"
    },
    {
      id: 4,
      question: "What will be the output of: for(int i=5; i>0; i--) System.out.print(i);",
      options: ["12345", "54321", "01234", "43210"],
      correctAnswer: 1,
      explanation: "The loop counts down from 5 to 1"
    },
    {
      id: 5,
      question: "Which loop is best for iterating over an array when you need the index?",
      options: ["While loop", "Do-while loop", "Enhanced for loop", "Traditional for loop"],
      correctAnswer: 3,
      explanation: "Traditional for loop provides direct access to array indices"
    },
    {
      id: 6,
      question: "What happens when you use break in a nested loop?",
      options: ["Breaks all loops", "Breaks innermost loop only", "Breaks outermost loop only", "Causes compilation error"],
      correctAnswer: 1,
      explanation: "break only exits the innermost loop containing it"
    },
    {
      id: 7,
      question: "What will happen if you omit the increment expression in a for loop?",
      options: [
        "Compilation error",
        "Runtime error",
        "Infinite loop",
        "Loop runs once"
      ],
      correctAnswer: 2,
      explanation: "Without increment, the loop condition never changes, causing infinite loop"
    },
    {
      id: 8,
      question: "Which statement about enhanced for loop is correct?",
      options: [
        "Can modify array elements",
        "Can access array indices",
        "Only works with arrays",
        "Best for read-only operations"
      ],
      correctAnswer: 3,
      explanation: "Enhanced for loop is ideal for read-only operations on collections"
    },
    {
      id: 9,
      question: "What's the difference between break and continue?",
      options: [
        "No difference",
        "break exits loop, continue skips iteration",
        "continue exits loop, break skips iteration",
        "Both exit the loop"
      ],
      correctAnswer: 1,
      explanation: "break terminates the loop, continue skips to next iteration"
    },
    {
      id: 10,
      question: "What happens in: for(;;) { System.out.println('Hi'); }?",
      options: [
        "Compilation error",
        "Prints Hi once",
        "Infinite loop printing Hi",
        "Runtime error"
      ],
      correctAnswer: 2,
      explanation: "Empty for loop conditions create an infinite loop"
    },
    {
      id: 11,
      question: "Which loop is best for pattern printing?",
      options: [
        "While loop",
        "Do-while loop",
        "For loop",
        "Enhanced for loop"
      ],
      correctAnswer: 2,
      explanation: "For loop is ideal for pattern printing due to its counter control"
    },
    {
      id: 12,
      question: "What's the output of: for(int i=0; i<5; i+=2) System.out.print(i);",
      options: ["01234", "02468", "024", "135"],
      correctAnswer: 2,
      explanation: "Loop increments by 2, printing 0, 2, and 4"
    },
    {
      id: 13,
      question: "How can you iterate an array in reverse?",
      options: [
        "Using enhanced for loop",
        "for(int i=array.length; i>=0; i--)",
        "for(int i=array.length-1; i>=0; i--)",
        "Not possible with for loop"
      ],
      correctAnswer: 2,
      explanation: "Array indices go from length-1 to 0"
    },
    {
      id: 14,
      question: "What's wrong with: for(int i=0; i<5; i--)?",
      options: [
        "Syntax error",
        "Nothing wrong",
        "Infinite loop",
        "Loop never executes"
      ],
      correctAnswer: 2,
      explanation: "Decrementing when condition needs increment causes infinite loop"
    },
    {
      id: 15,
      question: "Which variable scope is correct in a for loop?",
      options: [
        "Variables declared in initialization are available after loop",
        "Variables declared in initialization are only available inside loop",
        "Loop variables can be used anywhere in program",
        "Loop variables must be declared before loop"
      ],
      correctAnswer: 1,
      explanation: "Variables declared in for loop initialization are scoped to the loop"
    },
    {
      id: 16,
      question: "What's the best way to iterate over String characters?",
      options: [
        "While loop",
        "Do-while loop",
        "For loop with charAt()",
        "Enhanced for loop"
      ],
      correctAnswer: 2,
      explanation: "For loop with charAt() provides both index and character access"
    },
    {
      id: 17,
      question: "How do you terminate a nested loop immediately?",
      options: [
        "Use return",
        "Use break with label",
        "Use continue",
        "Use multiple breaks"
      ],
      correctAnswer: 1,
      explanation: "Break with label can exit multiple nested loops"
    },
    {
      id: 18,
      question: "What's the correct way to iterate over multiple arrays simultaneously?",
      options: [
        "Multiple enhanced for loops",
        "Single enhanced for loop",
        "Single for loop with same index",
        "Not possible"
      ],
      correctAnswer: 2,
      explanation: "Single for loop can use same index for multiple arrays"
    },
    {
      id: 19,
      question: "Which loop provides best performance for large collections?",
      options: [
        "While loop",
        "Traditional for loop",
        "Enhanced for loop",
        "Do-while loop"
      ],
      correctAnswer: 1,
      explanation: "Traditional for loop has less overhead for large collections"
    },
    {
      id: 20,
      question: "What happens when modifying loop variable inside the loop?",
      options: [
        "Compilation error",
        "Runtime error",
        "Unpredictable behavior",
        "Nothing changes"
      ],
      correctAnswer: 2,
      explanation: "Modifying loop variable inside loop can lead to unexpected results"
    }
  ];

  const codingExercises = {
    exercise1: {
      title: "Pattern Generator",
      description: "Create a program that generates a pyramid pattern with numbers",
      template: `public class PyramidPattern {
    public static void main(String[] args) {
        int rows = 5;
        // Generate number pyramid pattern
    }
}`,
      solution: `for(int i = 1; i <= rows; i++) {
    // Print spaces
    for(int j = 1; j <= rows-i; j++) {
        System.out.print(" ");
    }
    // Print numbers
    for(int k = 1; k <= i; k++) {
        System.out.print(i + " ");
    }
    System.out.println();
}`,
      hint: "Use nested loops - one for spaces, one for numbers"
    },
    exercise2: {
      title: "Number Triangle",
      description: "Create a program that prints a number triangle pattern",
      template: `public class NumberTriangle {
    public static void main(String[] args) {
        int n = 5;
        // Generate number triangle pattern
    }
}`,
      solution: `for(int i = 1; i <= n; i++) {
    for(int j = 1; j <= i; j++) {
        System.out.print(j + " ");
    }
    System.out.println();
}`,
      hint: "Use nested loops where inner loop prints numbers from 1 to row number"
    },
    exercise3: {
      title: "Fibonacci Series Generator",
      description: "Generate Fibonacci series up to n terms using for loop",
      template: `public class FibonacciGenerator {
    public static void main(String[] args) {
        int n = 10;  // Number of terms
        // Generate Fibonacci series
    }
}`,
      solution: `int first = 0, second = 1;
System.out.print(first + " " + second + " ");
for(int i = 2; i < n; i++) {
    int next = first + second;
    System.out.print(next + " ");
    first = second;
    second = next;
}`,
      hint: "Keep track of previous two numbers to generate next number"
    },
    exercise4: {
      title: "Prime Number Checker",
      description: "Check if a given number is prime using for loop",
      template: `public class PrimeChecker {
    public static void main(String[] args) {
        int num = 17;
        // Check if number is prime
    }
}`,
      solution: `boolean isPrime = true;
if(num <= 1) isPrime = false;
for(int i = 2; i <= Math.sqrt(num); i++) {
    if(num % i == 0) {
        isPrime = false;
        break;
    }
}
System.out.println(num + " is " + (isPrime ? "prime" : "not prime"));`,
      hint: "Check divisibility up to square root of the number"
    },
    exercise5: {
      title: "Diamond Pattern Generator",
      description: "Create a program to print a diamond pattern of stars",
      template: `public class DiamondPattern {
    public static void main(String[] args) {
        int n = 5;  // Height of half diamond
        // Generate diamond pattern
    }
}`,
      solution: `// Upper half
for(int i = 1; i <= n; i++) {
    // Print spaces
    for(int j = 1; j <= n-i; j++) {
        System.out.print(" ");
    }
    // Print stars
    for(int j = 1; j <= 2*i-1; j++) {
        System.out.print("*");
    }
    System.out.println();
}
// Lower half
for(int i = n-1; i >= 1; i--) {
    // Print spaces
    for(int j = 1; j <= n-i; j++) {
        System.out.print(" ");
    }
    // Print stars
    for(int j = 1; j <= 2*i-1; j++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      hint: "Split pattern into upper and lower halves"
    },
    exercise6: {
      title: "Number Pattern Spiral",
      description: "Generate a spiral pattern of numbers in a square matrix",
      template: `public class SpiralPattern {
    public static void main(String[] args) {
        int n = 4;  // Size of square matrix
        // Generate spiral pattern
    }
}`,
      solution: `int[][] matrix = new int[n][n];
int value = 1;
int minRow = 0, maxRow = n-1;
int minCol = 0, maxCol = n-1;

while (value <= n*n) {
    // Right
    for(int i = minCol; i <= maxCol; i++) {
        matrix[minRow][i] = value++;
    }
    minRow++;
    
    // Down
    for(int i = minRow; i <= maxRow; i++) {
        matrix[i][maxCol] = value++;
    }
    maxCol--;
    
    // Left
    for(int i = maxCol; i >= minCol; i--) {
        matrix[maxRow][i] = value++;
    }
    maxRow--;
    
    // Up
    for(int i = maxRow; i >= minRow; i--) {
        matrix[i][minCol] = value++;
    }
    minCol++;
}

// Print matrix
for(int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) {
        System.out.printf("%3d", matrix[i][j]);
    }
    System.out.println();
}`,
      hint: "Move in right, down, left, up pattern while updating boundaries"
    },
    exercise7: {
      title: "Floyd's Triangle Generator",
      description: "Create a program to print Floyd's triangle pattern",
      template: `public class FloydsTriangle {
    public static void main(String[] args) {
        int rows = 5;
        // Generate Floyd's triangle
    }
}`,
      solution: `int number = 1;
for(int i = 1; i <= rows; i++) {
    for(int j = 1; j <= i; j++) {
        System.out.print(number + " ");
        number++;
    }
    System.out.println();
}
/* Output:
1 
2 3 
4 5 6 
7 8 9 10 
11 12 13 14 15 
*/`,
      hint: "Use a counter variable that increments with each number printed"
    },
    exercise8: {
      title: "Pascal's Triangle",
      description: "Generate Pascal's triangle using nested loops",
      template: `public class PascalsTriangle {
    public static void main(String[] args) {
        int rows = 5;
        // Generate Pascal's triangle
    }
}`,
      solution: `for(int i = 0; i < rows; i++) {
    int number = 1;
    // Print spaces
    for(int j = 0; j < rows - i - 1; j++) {
        System.out.print("  ");
    }
    for(int j = 0; j <= i; j++) {
        System.out.printf("%4d", number);
        number = number * (i - j) / (j + 1);
    }
    System.out.println();
}`,
      hint: "Use combination formula: C(n,r) = C(n,r-1) * (n-r+1)/r"
    },
    exercise9: {
      title: "Butterfly Pattern",
      description: "Create a butterfly pattern using stars and spaces",
      template: `public class ButterflyPattern {
    public static void main(String[] args) {
        int n = 4;  // Half height of butterfly
        // Generate butterfly pattern
    }
}`,
      solution: `// Upper half
for(int i = 1; i <= n; i++) {
    // Left stars
    for(int j = 1; j <= i; j++) 
        System.out.print("*");
    // Spaces
    for(int j = 1; j <= 2*(n-i); j++) 
        System.out.print(" ");
    // Right stars
    for(int j = 1; j <= i; j++) 
        System.out.print("*");
    System.out.println();
}
// Lower half
for(int i = n; i >= 1; i--) {
    for(int j = 1; j <= i; j++) 
        System.out.print("*");
    for(int j = 1; j <= 2*(n-i); j++) 
        System.out.print(" ");
    for(int j = 1; j <= i; j++) 
        System.out.print("*");
    System.out.println();
}`,
      hint: "Split into upper and lower halves, each with stars-spaces-stars pattern"
    },
    exercise10: {
      title: "Character Pattern",
      description: "Create an alphabet pattern pyramid",
      template: `public class AlphabetPattern {
    public static void main(String[] args) {
        int rows = 5;
        // Generate alphabet pyramid
    }
}`,
      solution: `char ch = 'A';
for(int i = 1; i <= rows; i++) {
    // Print spaces
    for(int j = rows; j > i; j--) {
        System.out.print(" ");
    }
    // Print characters
    for(int k = 1; k <= i; k++) {
        System.out.print(ch + " ");
    }
    ch++;
    System.out.println();
}
/* Output:
    A 
   B B 
  C C C 
 D D D D 
E E E E E 
*/`,
      hint: "Use a char variable that increments with each row"
    }
  };

  const tryYourselfQuestions = [
    "Create a multiplication table generator for numbers 1-10",
    "Write a program to find factorial using for loop",
    "Generate Fibonacci sequence up to n terms",
    "Print all prime numbers between 1 to 100",
    "Create a program to print Pascal's triangle",
    "Generate a butterfly pattern using stars",
    "Print a hollow square pattern",
    "Create a program to print Floyd's Triangle",
    "Write a program to calculate sum of digits of a number",
    "Generate a pattern of alternating 0s and 1s",
    "Print all Armstrong numbers between 1 to 1000",
    "Create a program to reverse a number using for loop",
    "Print a rhombus pattern using stars",
    "Generate a pattern of increasing and decreasing numbers",
    "Create a program to find GCD using for loop",
    "Print a spiral pattern of numbers",
    "Generate a pattern of alphabets in pyramid form",
    "Create a program to check if a number is palindrome",
    "Print a pattern of numbers in diamond shape",
    "Generate multiplication tables from 1 to 10",
    "Create a program to print alphabet diamond pattern",
    "Generate a spiral of prime numbers",
    "Print Pascal's triangle using binomial coefficients"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Practice Set: For Loops in Java 🔄
      </h1>

      {/* MCQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Multiple Choice Questions</h2>
        {mcqQuestions.map((question) => (
          <MCQ
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id]}
            onAnswerSelect={(id, answer) => 
              setSelectedAnswers(prev => ({...prev, [id]: answer}))}
          />
        ))}
      </section>

      {/* Coding Exercises Section */}
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
              onToggle={() => setExpandedSolutions(prev => ({...prev, [key]: !prev[key]}))}
            />

            <Hint 
              hint={exercise.hint}
              isExpanded={expandedHints[key]}
              onToggle={() => setExpandedHints(prev => ({...prev, [key]: !prev[key]}))}
            />
          </div>
        ))}
      </section>

      {/* Try It Yourself Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Try It Yourself! 🚀</h2>
        <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            {tryYourselfQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
};

export default PracticeSetForLoops;
