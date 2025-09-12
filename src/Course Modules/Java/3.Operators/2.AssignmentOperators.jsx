import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const AssignmentOperators = () => {
  const examples = {
    basicAssignment: {
      title: '📝 Basic Assignment',
      code: `public class BasicAssignment {
    public static void main(String[] args) {
        // Simple assignment
        int number = 10;
        
        // Compound assignments
        number += 5;  // Same as: number = number + 5
        System.out.println("After += 5: " + number);  // 15
        
        number -= 3;  // Same as: number = number - 3
        System.out.println("After -= 3: " + number);  // 12
        
        number *= 2;  // Same as: number = number * 2
        System.out.println("After *= 2: " + number);  // 24
        
        number /= 4;  // Same as: number = number / 4
        System.out.println("After /= 4: " + number);  // 6
        
        number %= 4;  // Same as: number = number % 4
        System.out.println("After %= 4: " + number);  // 2
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    practiceQuestion1: {
      title: '🎯 Practice: Score Calculator',
      code: `public class ScoreCalculator {
    public static void main(String[] args) {
        // TODO: Create a program that:
        // 1. Starts with a score of 100
        // 2. Adds 50 points using +=
        // 3. Doubles the score using *=
        // 4. Subtracts 25 points using -=
        // Print the score after each change
        
        int score = 100;
        // Your code here
    }
}`
    },

    practiceQuestion2: {
      title: '🎯 Practice: Temperature Converter',
      code: `import java.util.Scanner;

public class TemperatureConverter {
    public static void main(String[] args) {
        // TODO: Create a program that:
        // 1. Takes temperature in Celsius
        // 2. Converts it to Fahrenheit using compound operators
        // Formula: (C × 9/5) + 32 = F
        // Break this down using compound operators!
        
        Scanner scan = new Scanner(System.in);
        System.out.println("Enter temperature in Celsius: ");
        double celsius = scan.nextDouble();
        // Your code here
        
        scan.close();
    }
}`
    }
  };

  const conceptSections = [
    {
      icon: "📝",
      title: "Basic Assignment",
      content: [
        "The simple assignment operator (=) assigns a value to a variable.",
        "It's the most basic and commonly used operator."
      ],
      code: `int number = 10;
String text = "Hello";
boolean flag = true;`
    },
    {
      icon: "🔄",
      title: "Compound Assignment",
      content: [
        "Compound operators combine operation and assignment in one step.",
        "They make code shorter and more efficient."
      ],
      code: `number += 5;  // number = number + 5
score *= 2;  // score = score * 2
total /= 4;  // total = total / 4`
    }
  ];

  const basicFeatures = [
    { icon: "=", text: "Simple assignment" },
    { icon: "📝", text: "Right-to-left evaluation" },
    { icon: "🎯", text: "Type checking" }
  ];

  const compoundFeatures = [
    { icon: "+=", text: "Add and assign" },
    { icon: "-=", text: "Subtract and assign" },
    { icon: "*=", text: "Multiply and assign" },
    { icon: "/=", text: "Divide and assign" },
    { icon: "%=", text: "Modulus and assign" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Assignment Operators in Java ✍️"
        description="Assignment operators help us store and update values in variables. They're like shortcuts that make our code cleaner and more efficient! Let's master them! 🎯"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeyFeatures
          title="Basic Assignment"
          items={basicFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Compound Assignment"
          items={compoundFeatures}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">See It In Action! 🚀</h2>
        <CodeSnippet {...examples.basicAssignment} />
      </section>

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Confusing = (assignment) with == (comparison)",
          "Forgetting that /= and %= work like regular division and modulus",
          "Not initializing variables before using compound assignment"
        ]}
        alternatives={[
          "Use meaningful variable names",
          "Initialize variables before using compound operators",
          "Consider potential division by zero with /=",
          "Be careful with type conversion in compound assignments"
        ]}
      />

      <HandsOn
        title="Practice 1: Score Calculator 🎮"
        description="Let's create a program that manipulates a game score using different assignment operators!"
        defaultCode={examples.practiceQuestion1.code}
      />

      <HandsOn
        title="Practice 2: Temperature Converter 🌡️"
        description="Create a temperature converter using compound assignment operators!"
        defaultCode={examples.practiceQuestion2.code}
      />

      <ImportantNote
        title="Pro Tips!"
        points={[
          "Compound operators perform the operation and assignment in one step",
          "They're more efficient than separate operations",
          "Be careful with type promotion in compound assignments",
          "Initialize variables before using compound operators"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these important points about assignment operators:
          • = assigns values to variables
          • Compound operators (+=, -=, *=, /=, %=) combine operation and assignment
          • Always initialize variables before using compound operators
          • Be mindful of type conversions in assignments
        `}
        variant="green"
      />
    </div>
  );
};

export default AssignmentOperators;
