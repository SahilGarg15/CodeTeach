import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const ArithmeticOperators = () => {
  const examples = {
    basicOperators: {
      title: '➕ Basic Arithmetic Operators',
      code: `public class BasicArithmetic {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        
        System.out.println("Addition: " + (a + b));      // 15
        System.out.println("Subtraction: " + (a - b));   // 5
        System.out.println("Multiplication: " + (a * b)); // 50
        System.out.println("Division: " + (a / b));      // 2
        System.out.println("Modulus: " + (a % b));       // 0
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    divisionTypes: {
      title: '📊 Integer vs Float Division',
      code: `public class DivisionTypes {
    public static void main(String[] args) {
        int x = 10;
        int y = 3;
        
        // Integer division
        System.out.println("Integer division: " + (x / y));     // 3
        
        // Float division
        System.out.println("Float division: " + (x / (float)y)); // 3.3333333
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    practiceExample: {
      title: '🎯 Practice Problem',
      code: `public class Calculator {
    public static void main(String[] args) {
        // TODO: Create a simple calculator that:
        // 1. Takes two numbers from user
        // 2. Performs all arithmetic operations
        // 3. Displays results nicely formatted
        
        Scanner scan = new Scanner(System.in);
        // Your code here
    }
}`
    }
  };

  const conceptSections = [
    {
      icon: "➕",
      title: "Basic Arithmetic",
      content: [
        "Arithmetic operators perform basic mathematical operations.",
        "They work with numeric data types (int, double, etc.)."
      ],
      code: `int sum = a + b;     // Addition
int diff = a - b;    // Subtraction
int product = a * b; // Multiplication`
    },
    {
      icon: "➗",
      title: "Division Types",
      content: [
        "Integer division drops decimal places.",
        "Float division preserves decimal places."
      ],
      code: `int result1 = 10 / 3;      // = 3
double result2 = 10.0 / 3.0; // = 3.3333...`
    }
  ];

  const basicOperators = [
    { icon: "➕", text: "Addition (+)" },
    { icon: "➖", text: "Subtraction (-)" },
    { icon: "✖️", text: "Multiplication (*)" },
    { icon: "➗", text: "Division (/)" },
    { icon: "🔄", text: "Modulus (%)" }
  ];

  const quickTips = [
    { icon: "💡", text: "Integer division gives integer result" },
    { icon: "📝", text: "Use float/double for decimal division" },
    { icon: "🎯", text: "Modulus finds remainders" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Arithmetic Operators in Java 🧮"
        description="Arithmetic operators are the basic building blocks of mathematical operations in Java. They help us perform calculations just like we do in regular math! 🎯"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Basic Operators"
          items={basicOperators}
          variant="blue"
        />
        <KeyFeatures
          title="Quick Tips 💡"
          items={quickTips}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicOperators} />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Understanding Division 📊</h2>
        <CodeSnippet {...examples.divisionTypes} />
        
        <ImportantNote
          title="Important Note!"
          points={[
            "Integer division drops decimal places",
            "Use at least one floating-point number for decimal results",
            "Always check for division by zero"
          ]}
          variant="yellow"
        />
      </section>

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Forgetting that integer division truncates decimals",
          "Not handling division by zero",
          "Mixing integer and floating-point calculations without proper casting"
        ]}
        alternatives={[
          "Cast to double/float for decimal division",
          "Always validate denominators",
          "Use explicit type casting when mixing types",
          "Break complex calculations into steps"
        ]}
      />

      <HandsOn
        title="Let's Practice! 💪"
        description="Create a calculator program that takes two numbers from the user and performs all arithmetic operations. Try to make it user-friendly!"
        defaultCode={examples.practiceExample.code}
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these essential points about arithmetic operators:
          • Basic operators: +, -, *, /, %
          • Integer division drops decimal places
          • Use floating-point numbers for decimal division
          • Always handle division by zero cases
          • Modulus (%) is great for finding remainders
        `}
        variant="green"
      />
    </div>
  );
};

export default ArithmeticOperators;
