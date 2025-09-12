import React, { useState } from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import MCQ from '../../../Frontend/Components/practice compnenets/mcq';

const PatternPrograms = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examples = {
    thinkingProcess: {
      title: '🤔 How to Think About Patterns',
      code: `/* Pattern Thinking Process:
1. Identify the pattern structure (rows and columns)
2. Find relationships between row number and:
   - Number of spaces
   - Number of symbols
   - What symbol to print
3. Convert these relationships into loops

Example Pattern:
   *     (row 1: 3 spaces, 1 star)
  **     (row 2: 2 spaces, 2 stars)  
 ***     (row 3: 1 space,  3 stars)
****     (row 4: 0 spaces, 4 stars)

Relationships:
- spaces = (total rows - current row)
- stars = current row number
*/
public class PatternThinking {
    public static void main(String[] args) {
        int rows = 4;
        // For each row
        for (int i = 1; i <= rows; i++) {
            // Print spaces first
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            // Then print stars
            for (int k = 1; k <= i; k++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },
    starPattern: {
      title: '⭐ Basic Star Pattern',
      code: `public class StarPattern {
    public static void main(String[] args) {
        int rows = 5;
        // Print increasing triangle
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
/* Output:
* 
* * 
* * * 
* * * * 
* * * * * 
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    numberPattern: {
      title: '🔢 Number Pattern',
      code: `public class NumberPattern {
    public static void main(String[] args) {
        int rows = 5;
        // Print number pyramid
        for (int i = 1; i <= rows; i++) {
            // Print spaces
            for (int j = rows - i; j >= 1; j--) {
                System.out.print(" ");
            }
            // Print numbers
            for (int k = 1; k <= i; k++) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
    }
}
/* Output:
    1 
   2 2 
  3 3 3 
 4 4 4 4 
5 5 5 5 5 
*/`,
      showLineNumbers: true,
      showCopyButton: true
    },
    advancedPattern: {
      title: '🌟 Advanced Pattern with Explanation',
      code: `public class AdvancedPattern {
    public static void main(String[] args) {
        int n = 5;
        /* Pattern Logic:
         1        -- row 1: 1 number
         2 2      -- row 2: 2 numbers
         3 3 3    -- row 3: 3 numbers
         4 4 4 4  -- row 4: 4 numbers
         5 5 5 5 5-- row 5: 5 numbers
         4 4 4 4  -- row 6: 4 numbers
         3 3 3    -- row 7: 3 numbers
         2 2      -- row 8: 2 numbers
         1        -- row 9: 1 number
        */
        
        // Upper half
        for (int i = 1; i <= n; i++) {
            // Print numbers i times
            for (int j = 1; j <= i; j++) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
        
        // Lower half
        for (int i = n-1; i >= 1; i--) {
            // Print numbers i times
            for (int j = 1; j <= i; j++) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const patternFeatures = [
    { icon: "🔄", text: "Uses nested loops" },
    { icon: "📐", text: "Creates visual patterns" },
    { icon: "🎯", text: "Improves logic building" }
  ];

  const applicationFeatures = [
    { icon: "🎨", text: "Visual design" },
    { icon: "🧮", text: "Mathematical patterns" },
    { icon: "🎯", text: "Algorithm practice" }
  ];

  const conceptSections = [
    {
      icon: "🧩",
      title: "Breaking Down Patterns",
      content: [
        "Every pattern can be broken into rows and columns",
        "Each row follows a specific rule",
        "Identify the relationship between row number and pattern elements",
        "Look for repeating elements or sequences"
      ],
      code: `// Example: Breaking down a triangle
/*
Row 1: 1 star   (1 element)
Row 2: 2 stars  (2 elements)
Row 3: 3 stars  (3 elements)
Pattern: row number = number of elements
*/`
    },
    {
      icon: "🔄",
      title: "Pattern Basics",
      content: [
        "Patterns are created using nested loops",
        "Outer loop controls rows",
        "Inner loop controls columns",
        "Print statement controls pattern elements"
      ],
      code: `for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}`
    },
    {
      icon: "📐",
      title: "Pattern Types",
      content: [
        "Triangle patterns",
        "Square patterns",
        "Number patterns",
        "Character patterns"
      ],
      code: `// Square pattern
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
        System.out.print("* ");
    }
    System.out.println();
}`
    },
    {
      icon: "🎯",
      title: "Pattern Building Steps",
      content: [
        "1. Draw the pattern on paper first",
        "2. Count rows and columns",
        "3. Find the pattern in each row",
        "4. Identify spaces and characters needed",
        "5. Write the outer loop for rows",
        "6. Write inner loop(s) for spaces and characters"
      ]
    }
  ];

  const patternTypes = [
    { icon: "📐", text: "Right Triangle", description: "Increases elements from left to right" },
    { icon: "🔄", text: "Inverted Triangle", description: "Decreases elements from top to bottom" },
    { icon: "💠", text: "Diamond", description: "Combines increasing and decreasing triangles" },
    { icon: "🔲", text: "Square", description: "Same number of elements in each row" }
  ];

  const mcqQuestions = [
    {
      id: 1,
      question: "In a triangle pattern, what is the relationship between row number and number of stars?",
      options: [
        "Row number equals number of stars",
        "Stars are always fixed",
        "No relationship exists",
        "Stars decrease with row number"
      ],
      correctAnswer: 0,
      explanation: "In a basic triangle pattern, the row number determines how many stars to print in that row."
    },
    {
      id: 2,
      question: "What determines the number of rows in a pattern?",
      options: [
        "Inner loop variable",
        "Outer loop variable",
        "Print statement",
        "Pattern type"
      ],
      correctAnswer: 1,
      explanation: "The outer loop control variable determines the number of rows in a pattern."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Master Pattern Programming in Java 🎨"
        description={`
          Pattern programming is like solving a puzzle! We'll learn:
          • How to break down patterns into simple steps
          • Different types of patterns and their logic
          • Tips and tricks for solving pattern problems
          • Common pattern programming techniques
        `}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Pattern Characteristics 📐"
          items={patternFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Applications 🎯"
          items={applicationFeatures}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-green-400">Pattern Thinking Process 🤔</h2>
        <CodeSnippet {...examples.thinkingProcess} />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Pattern Examples 💡</h2>
        <CodeSnippet {...examples.starPattern} />
        <CodeSnippet {...examples.numberPattern} />
        <CodeSnippet {...examples.advancedPattern} />
      </section>

      <MistakesToAvoid
        title="Common Pattern Programming Mistakes"
        mistakes={[
          "Incorrect loop boundaries",
          "Missing nested loop",
          "Wrong spacing in patterns",
          "Forgetting line breaks"
        ]}
        alternatives={[
          "Double-check loop conditions",
          "Use nested loops for 2D patterns",
          "Add proper spaces between elements",
          "Include System.out.println() for new lines"
        ]}
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Test Your Knowledge 🤓</h2>
        {mcqQuestions.map((question) => (
          <MCQ
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id]}
            onAnswerSelect={(id, answer) => setSelectedAnswers(prev => ({...prev, [id]: answer}))}
          />
        ))}
      </section>

      <HandsOn
        title="Progressive Pattern Exercises 💪"
        description="Try these patterns in increasing order of difficulty:"
        exercises={[
          {
            title: "Level 1: Right Triangle",
            description: "Create a right triangle pattern with stars",
            hint: "Use row number to determine number of stars"
          },
          {
            title: "Level 2: Pyramid",
            description: "Create a pyramid pattern with spaces and stars",
            hint: "Consider both spaces and stars in each row"
          },
          {
            title: "Level 3: Diamond",
            description: "Create a diamond pattern by combining pyramids",
            hint: "Split the pattern into upper and lower halves"
          }
        ]}
      />

      <ImportantNote
        title="Pattern Programming Tips"
        points={[
          "Understand the role of each loop",
          "Visualize the pattern before coding",
          "Start with simple patterns and gradually move to complex ones",
          "Practice regularly to improve"
        ]}
      />
    </div>
  );
};

export default PatternPrograms;
