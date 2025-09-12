import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import CodeEditor from '../../../Frontend/Components/Code Components/CodeEditor';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';
import Hint from '../../../Frontend/Components/practice compnenets/hint';
import ViewSolution from '../../../Frontend/Components/practice compnenets/viewsolution';

const PracticeSetIfElse = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [expandedHints, setExpandedHints] = useState({});
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const mcqQuestions = [
    {
      id: 1,
      question: "What will be the output of: if(true) if(false) print('A'); else print('B');",
      options: [
        "A",
        "B",
        "Nothing",
        "Error"
      ],
      correctAnswer: 1,
      explanation: "The else belongs to the nearest if statement (false), so B is printed."
    },
    {
      id: 2,
      question: "How many code paths are possible with a simple if-else statement?",
      options: [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      correctAnswer: 1,
      explanation: "A simple if-else statement has exactly two possible paths: the if block or the else block."
    },
    {
      id: 3,
      question: "Which statement is true about if-else-if ladder?",
      options: [
        "All blocks can execute if all conditions are true",
        "Only one block executes even if multiple conditions are true",
        "The else block always executes last",
        "It requires an else block"
      ],
      correctAnswer: 1,
      explanation: "In an if-else-if ladder, only the first true condition's block executes."
    },
    {
      id: 4,
      question: "What happens if you omit curly braces {} in an if statement?",
      options: [
        "All following lines are part of the if block",
        "Only the first line is part of the if block",
        "Compilation error",
        "Runtime error"
      ],
      correctAnswer: 1,
      explanation: "Without curly braces, only the immediately following line is considered part of the if block."
    },
    {
      id: 5,
      question: "Which of these is NOT valid in an if condition?",
      options: [
        "if(true)",
        "if(1)",
        "if(boolean_variable)",
        "if(2+2)"
      ],
      correctAnswer: 1,
      explanation: "In Java, the if condition must evaluate to a boolean. Unlike C/C++, numbers cannot be used directly."
    },
    {
      id: 6,
      question: "What is the result of nested if statements with multiple else clauses?",
      options: [
        "Each else matches with its nearest if",
        "Each else matches with the first if",
        "All else clauses are optional",
        "It causes a compilation error"
      ],
      correctAnswer: 0,
      explanation: "In nested if statements, each else clause is matched with its nearest preceding unmatched if statement."
    },
    {
      id: 7,
      question: "What is the maximum number of else-if statements you can have in a ladder?",
      options: [
        "Only 1",
        "Maximum 5",
        "Maximum 10",
        "No limit"
      ],
      correctAnswer: 3,
      explanation: "There is no technical limit to the number of else-if statements, though too many can make code hard to maintain."
    },
    {
      id: 8,
      question: "What will be the output of: if(true) { if(true) { System.out.println('A'); } } else { System.out.println('B'); }",
      options: ["A", "B", "AB", "Nothing"],
      correctAnswer: 0,
      explanation: "The nested if statement is executed because the outer if is true, and the inner if is also true."
    },
    {
      id: 9,
      question: "In an if-else statement, can you have multiple statements in the if block without curly braces?",
      options: [
        "Yes, always",
        "No, never",
        "Only if they're on the same line",
        "Only if using semicolons"
      ],
      correctAnswer: 1,
      explanation: "Multiple statements in an if block must be enclosed in curly braces."
    },
    {
      id: 10,
      question: "What happens if you write: if(x = 5) in Java?",
      options: [
        "Compares x with 5",
        "Assigns 5 to x",
        "Compilation error",
        "Runtime error"
      ],
      correctAnswer: 2,
      explanation: "Java requires boolean conditions in if statements. Assignment returns a value, not a boolean."
    },
    {
      id: 20,
      question: "What is the correct way to check if a String variable name is empty?",
      options: [
        "if(name == '')",
        "if(name.isEmpty())",
        "if(name.length == 0)",
        "if(name.size() == 0)"
      ],
      correctAnswer: 1,
      explanation: "isEmpty() is the proper method to check if a String is empty in Java."
    },
    {
      id: 11,
      question: "What is the output of: if(true) System.out.println('A'); System.out.println('B');",
      options: ["A only", "B only", "A and B", "Compilation error"],
      correctAnswer: 2,
      explanation: "Without curly braces, only 'A' is part of the if block. 'B' is always printed."
    },
    {
      id: 12,
      question: "Which is a valid condition in an if statement?",
      options: [
        "if(x = 5)",
        "if(x == 5)",
        "if(x === 5)",
        "if(x := 5)"
      ],
      correctAnswer: 1,
      explanation: "== is the comparison operator in Java. = is assignment, === doesn't exist in Java."
    },
    {
      id: 13,
      question: "What happens in: if(true); { System.out.println('Hello'); }",
      options: [
        "Hello is printed conditionally",
        "Hello is always printed",
        "Nothing is printed",
        "Compilation error"
      ],
      correctAnswer: 1,
      explanation: "The semicolon ends the if statement. The code block is independent and always executes."
    },
    {
      id: 14,
      question: "In nested if statements, how many else clauses can be present?",
      options: [
        "Only one for all if statements",
        "One for each if statement",
        "Maximum of two",
        "No else clauses allowed in nested if"
      ],
      correctAnswer: 1,
      explanation: "Each if statement can have its own else clause."
    },
    {
      id: 15,
      question: "What's wrong with: if(score >= 90 && <= 100)",
      options: [
        "Nothing wrong",
        "Missing second operand for <=",
        "Cannot use && with ranges",
        "Should use || instead"
      ],
      correctAnswer: 1,
      explanation: "Need to specify the variable for each comparison: score >= 90 && score <= 100"
    },
    {
      id: 16,
      question: "What is the result of: if(true && false || true)",
      options: [
        "true",
        "false",
        "Compilation error",
        "Runtime error"
      ],
      correctAnswer: 0,
      explanation: "&& has higher precedence than ||, so (true && false) is false, then false || true is true"
    },
    {
      id: 17,
      question: "Which is more efficient for multiple conditions?",
      options: [
        "Multiple if statements",
        "if-else-if ladder",
        "Nested if statements",
        "Depends on the specific conditions"
      ],
      correctAnswer: 3,
      explanation: "Efficiency depends on the relationships between conditions and probability of each case."
    },
    {
      id: 18,
      question: "What's the best practice for complex if conditions?",
      options: [
        "Use multiple nested if statements",
        "Write everything in one line",
        "Break into smaller, more readable conditions",
        "Use only simple conditions"
      ],
      correctAnswer: 2,
      explanation: "Breaking complex conditions into smaller, readable parts improves maintainability."
    },
    {
      id: 19,
      question: "What happens if a break statement is used in an if block?",
      options: [
        "Exits the if block",
        "Compilation error",
        "Exits the enclosing loop/switch only",
        "Program terminates"
      ],
      correctAnswer: 2,
      explanation: "break only affects loops and switch statements, not if blocks."
    }
  ];

  const codingExercises = {
    exercise1: {
      title: "Grade Calculator",
      description: "Write a program that assigns letter grades based on numerical scores: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60)",
      template: `public class GradeCalculator {
    public static void main(String[] args) {
        int score = 85;
        // TODO: Assign and print letter grade using if-else
    }
}`,
      solution: `if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else if (score >= 70) {
    System.out.println("Grade: C");
} else if (score >= 60) {
    System.out.println("Grade: D");
} else {
    System.out.println("Grade: F");
}`,
      hint: "Start with the highest grade and work your way down"
    },
    exercise2: {
      title: "Age Category Classifier",
      description: "Write a program that classifies people into age categories: Child (0-12), Teen (13-19), Adult (20-59), Senior (60+)",
      template: `public class AgeClassifier {
    public static void main(String[] args) {
        int age = 25;
        // TODO: Classify age using if-else statements
    }
}`,
      solution: `if (age >= 60) {
    System.out.println("Senior");
} else if (age >= 20) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teen");
} else if (age >= 0) {
    System.out.println("Child");
} else {
    System.out.println("Invalid age");
}`,
      hint: "Order your conditions from highest to lowest age range"
    },
    exercise3: {
      title: "Number Classifier",
      description: "Write a program that classifies a number as positive/negative/zero and even/odd",
      template: `public class NumberClassifier {
    public static void main(String[] args) {
        int number = -4;
        // TODO: Classify the number
    }
}`,
      solution: `if (number > 0) {
    System.out.print("Positive and ");
} else if (number < 0) {
    System.out.print("Negative and ");
} else {
    System.out.print("Zero and ");
}

if (number % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}`,
      hint: "Use separate if-else blocks for positive/negative and even/odd checks"
    },
    exercise4: {
      title: "Season Detector",
      description: "Write a program that determines the season based on month and temperature",
      template: `public class SeasonDetector {
    public static void main(String[] args) {
        int month = 7;  // 1-12
        double temp = 25.5;  // Celsius
        // TODO: Determine season using if-else
    }
}`,
      solution: `if (month >= 3 && month <= 5) {
    if (temp >= 15 && temp <= 25) {
        System.out.println("Spring");
    } else {
        System.out.println("Unusual Spring");
    }
} else if (month >= 6 && month <= 8) {
    if (temp >= 25) {
        System.out.println("Summer");
    } else {
        System.out.println("Mild Summer");
    }
} // ... continue for other seasons`,
      hint: "Consider both month ranges and temperature ranges for accurate season detection"
    },
    exercise5: {
      title: "Password Validator",
      description: "Check if a password meets security criteria: 8+ chars, 1+ uppercase, 1+ number",
      template: `public class PasswordValidator {
    public static void main(String[] args) {
        String password = "Pass123word";
        // TODO: Validate password
    }
}`,
      solution: `boolean hasUpperCase = false;
boolean hasNumber = false;
boolean isLongEnough = password.length() >= 8;

for (char c : password.toCharArray()) {
    if (Character.isUpperCase(c)) hasUpperCase = true;
    if (Character.isDigit(c)) hasNumber = true;
}

if (isLongEnough && hasUpperCase && hasNumber) {
    System.out.println("Valid password");
} else {
    System.out.println("Invalid password");
    if (!isLongEnough) System.out.println("Too short");
    if (!hasUpperCase) System.out.println("Need uppercase");
    if (!hasNumber) System.out.println("Need number");
}`,
      hint: "Break down the validation into separate checks"
    },
    exercise10: {
      title: "Ticket Price Calculator",
      description: "Calculate movie ticket price based on age, day of week, and show time",
      template: `public class TicketCalculator {
    public static void main(String[] args) {
        int age = 25;
        String day = "Saturday";
        int hour = 14;
        // TODO: Calculate ticket price
    }
}`,
      solution: `double basePrice = 12.00;
if (age < 12) {
    basePrice *= 0.5;  // 50% off for children
} else if (age >= 65) {
    basePrice *= 0.7;  // 30% off for seniors
}

if (day.equals("Tuesday")) {
    basePrice *= 0.8;  // Tuesday discount
}

if (hour < 17) {
    basePrice *= 0.9;  // Matinee discount
}

System.out.printf("Ticket price: $%.2f", basePrice);`,
      hint: "Apply discounts sequentially, considering age first, then day, then time"
    },
    exercise6: {
      title: "Triangle Type Checker",
      description: "Determine if a triangle is right-angled, acute, or obtuse based on its angles",
      template: `public class TriangleChecker {
    public static void main(String[] args) {
        int angle1 = 90;
        int angle2 = 45;
        int angle3 = 45;
        // TODO: Classify the triangle
    }
}`,
      solution: `if (angle1 + angle2 + angle3 != 180) {
    System.out.println("Not a valid triangle");
} else if (angle1 == 90 || angle2 == 90 || angle3 == 90) {
    System.out.println("Right-angled triangle");
} else if (angle1 > 90 || angle2 > 90 || angle3 > 90) {
    System.out.println("Obtuse triangle");
} else {
    System.out.println("Acute triangle");
}`,
      hint: "Check if angles sum to 180° first, then look for 90° angles"
    },
    exercise7: {
      title: "Leap Year Checker",
      description: "Check if a year is a leap year using nested if statements",
      template: `public class LeapYearChecker {
    public static void main(String[] args) {
        int year = 2024;
        // TODO: Check if it's a leap year
    }
}`,
      solution: `if (year % 4 == 0) {
    if (year % 100 == 0) {
        if (year % 400 == 0) {
            System.out.println("Leap Year");
        } else {
            System.out.println("Not a Leap Year");
        }
    } else {
        System.out.println("Leap Year");
    }
} else {
    System.out.println("Not a Leap Year");
}`,
      hint: "Divisible by 4, but century years must also be divisible by 400"
    },
    exercise8: {
      title: "Currency Exchange Validator",
      description: "Validate currency exchange based on amount limits and currency type",
      template: `public class CurrencyExchange {
    public static void main(String[] args) {
        double amount = 5000;
        String currency = "USD";
        boolean isWeekend = false;
        // TODO: Validate exchange possibility
    }
}`,
      solution: `if (amount > 0) {
    if (amount <= 10000) {
        if (!isWeekend) {
            System.out.println("Exchange permitted");
            if (currency.equals("USD") || currency.equals("EUR")) {
                System.out.println("Premium rate applies");
            } else {
                System.out.println("Standard rate applies");
            }
        } else {
            System.out.println("Weekend exchange not available");
        }
    } else {
        System.out.println("Amount exceeds daily limit");
    }
} else {
    System.out.println("Invalid amount");
}`,
      hint: "Check amount validity first, then timing, then currency type"
    },
    exercise9: {
      title: "Weather Activity Suggester",
      description: "Suggest activities based on temperature, precipitation, and wind speed",
      template: `public class WeatherActivity {
    public static void main(String[] args) {
        double temp = 22.5;    // Celsius
        boolean isRaining = false;
        double windSpeed = 15;  // km/h
        // TODO: Suggest activities
    }
}`,
      solution: `if (isRaining) {
    System.out.println("Indoor activities recommended");
    if (temp < 15) {
        System.out.println("Visit a museum or cinema");
    } else {
        System.out.println("Indoor sports or shopping");
    }
} else {
    if (temp > 25) {
        if (windSpeed < 25) {
            System.out.println("Beach or pool activities");
        } else {
            System.out.println("Park or garden visit");
        }
    } else if (temp > 15) {
        System.out.println("Hiking or cycling");
    } else {
        System.out.println("Dress warmly for outdoor activities");
    }
}`,
      hint: "Consider weather conditions in order of impact on activities"
    }
  };

  const tryYourselfQuestions = [
    "Write a program to check if a year is a leap year.",
    "Create a BMI calculator that provides weight status (underweight, normal, overweight).",
    "Build a simple calculator that performs different operations based on user input.",
    "Write a program to determine if a triangle is equilateral, isosceles, or scalene.",
    "Create a simple login system that checks username and password.",
    "Build a program that determines the quadrant of a coordinate point (x,y).",
    "Develop a program that classifies a character as vowel or consonant.",
    "Create a tax calculator with different rates for different income brackets.",
    "Write a program to check if a year is a century year.",
    "Build a credit score evaluator (poor, fair, good, excellent).",
    "Create a program to suggest clothing based on temperature and weather conditions.",
    "Develop a simple grading system with plus/minus grades (A+, A, A-, etc.).",
    "Write a program to validate a date (day, month, year).",
    "Create a program to check if three numbers can form a triangle.",
    "Build a simple traffic light simulator.",
    "Implement a shipping cost calculator based on package weight and destination",
    "Create a program that suggests a workout routine based on fitness level and available time",
    "Build a loan eligibility checker using income, credit score, and employment status",
    "Develop a restaurant tip calculator with different percentage options",
    "Create a game character damage calculator considering armor and resistance",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Practice Set: If-Else Statements in Java 🎯
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
          <p className="text-gray-300 mb-4">
            Challenge yourself with these problems! Try to solve them without looking at solutions:
          </p>
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

export default PracticeSetIfElse;
