import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const TakingInputInJava = () => {
  const examples = {
    basicInput: {
      title: '📥 Your First Input Program',
      code: `// First, we need to import Scanner - it's like borrowing a special tool
import java.util.Scanner;


public class MyFirstInput {
    public static void main(String[] args) {
        // Step 1: Create our Scanner tool
        Scanner scan = new Scanner(System.in);
        
        // Step 2: Ask the user for their name
        System.out.println("What is your name? ");
        
        // Step 3: Wait for user to type their name and save it
        String name = scan.nextLine();
        
        // Step 4: Say hello to the user
        System.out.println("Hello " + name + "! Nice to meet you!");
        
        // Step 5: Always clean up - close the scanner
        scan.close();
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    simpleCalculator: {
      title: '🔢 Getting Numbers from Users',
      code: `import java.util.Scanner;

public class SimpleCalculator {
    public static void main(String[] args) {
        // Create our Scanner
        Scanner scan = new Scanner(System.in);
        
        // Ask for the first number
        System.out.println("Enter first number: ");
        int number1 = scan.nextInt();
        
        // Ask for the second number
        System.out.println("Enter second number: ");
        int number2 = scan.nextInt();
        
        // Add the numbers and show result
        int sum = number1 + number2;
        System.out.println("The sum is: " + sum);
        
        scan.close();
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    differentTypes: {
      title: '📝 Getting Different Types of Input',
      code: `import java.util.Scanner;

public class UserDetails {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        
        // Getting text (String) input
        System.out.println("What is your name? ");
        String name = scan.nextLine();
        
        // Getting whole number (int) input
        System.out.println("How old are you? ");
        int age = scan.nextInt();
        
        // Getting decimal (double) input
        System.out.println("How tall are you (in meters)? ");
        double height = scan.nextDouble();
        
        // Printing everything back
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height + " meters");
        
        scan.close();
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    },

    practiceQuestion: {
      title: '🎯 Let\'s Practice!',
      code: `import java.util.Scanner;

public class AboutYou {
    public static void main(String[] args) {
        // Create a Scanner
        Scanner scan = new Scanner(System.in);
        
        // TODO: Ask the user for:
        // 1. Their favorite color
        // 2. Their lucky number
        // Then print a message using both inputs!
        
        scan.close();
    }
}`,
      showLineNumbers: true,
      showCopyButton: true
    }
  };

  const conceptSections = [
    {
      icon: "📚",
      title: "Understanding Scanner",
      content: [
        "Scanner is like a helper tool that reads input from various sources.",
        "Think of it as a friendly robot that helps your program understand what users type!",
        "Before using Scanner, we need to import it from java.util package."
      ],
      code: `import java.util.Scanner; // Import first!
Scanner scan = new Scanner(System.in);`
    },
    {
      icon: "🎯",
      title: "Reading Different Types",
      content: [
        "Scanner has different methods for reading different types of input:",
        "• nextLine() - reads text (whole line)",
        "• next() - reads a single word",
        "• nextInt() - reads whole numbers",
        "• nextDouble() - reads decimal numbers",
        "• nextBoolean() - reads true/false"
      ],
      code: `String name = scan.nextLine();    // "John Doe"
String word = scan.next();        // "John"
int age = scan.nextInt();         // 25
double height = scan.nextDouble(); // 5.9
boolean isStudent = scan.nextBoolean(); // true`
    }
  ];

  const scannerMethods = [
    { icon: "📝", text: "nextLine() - Full text line" },
    { icon: "🔤", text: "next() - Single word" },
    { icon: "🔢", text: "nextInt() - Whole numbers" },
    { icon: "📊", text: "nextDouble() - Decimal numbers" },
    { icon: "✅", text: "nextBoolean() - true/false" }
  ];

  const bestPractices = [
    { icon: "🎯", text: "Always close Scanner when done" },
    { icon: "⚠️", text: "Handle input errors" },
    { icon: "📝", text: "Show clear prompts" },
    { icon: "🔄", text: "Validate user input" }
  ];

  const extraConcepts = [
    {
      icon: "⚡",
      title: "Common Pitfalls & Solutions",
      content: [
        "Sometimes nextLine() behaves unexpectedly after nextInt()/nextDouble()",
        "This happens because numeric methods don't consume the newline character",
        "Solution: Add an extra nextLine() after numeric input"
      ],
      code: `int age = scan.nextInt();     // User types "25<enter>"
scan.nextLine();              // Consume leftover newline
String name = scan.nextLine(); // Now this works correctly`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Let's Learn About Taking Input! 🎮"
        description="Hey there! 👋 Today we're going to learn something super cool - how to make our programs talk to us! Instead of just showing messages, we'll make programs that can ask questions and remember our answers. It's like having a conversation with your computer! 🗣️💻"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyFeatures
          title="Scanner Methods 🛠️"
          items={scannerMethods}
          variant="blue"
        />
        <KeyFeatures
          title="Best Practices ✨"
          items={bestPractices}
          variant="purple"
        />
      </div>

      <ConceptExplanation sections={conceptSections} />

      <ImportantNote
        title="Before You Start!"
        points={[
          "Always import java.util.Scanner at the top of your file",
          "Create Scanner object only once and reuse it",
          "Remember to close Scanner when you're done",
          "Show clear messages before asking for input"
        ]}
        variant="yellow"
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.basicInput} />
        <CodeSnippet {...examples.simpleCalculator} />
        <CodeSnippet {...examples.differentTypes} />
      </section>

      <ConceptExplanation sections={extraConcepts} />

      <MistakesToAvoid
        title="Common Mistakes to Watch Out For!"
        mistakes={[
          "Forgetting to import Scanner",
          "Not closing Scanner when done",
          "Mixing nextLine() with other methods without handling newline",
          "Not handling invalid input",
          "Creating multiple Scanner objects unnecessarily"
        ]}
        alternatives={[
          "Always add import statement at the top",
          "Use try-with-resources or close Scanner in finally block",
          "Add extra nextLine() after numeric input if needed",
          "Use try-catch to handle invalid input",
          "Create one Scanner object and reuse it"
        ]}
      />

      <HandsOn
        title="Let's Practice! 💪"
        description="Create a program that asks for your favorite color and lucky number, then combines them into a fun message!"
        defaultCode={examples.practiceQuestion.code}
      />

      <ImportantNote
        title="Pro Tips for Beginners! 🌟"
        points={[
          "Always test your program with different types of input",
          "Think about what could go wrong (invalid input, wrong type)",
          "Use meaningful variable names for storing input",
          "Add helpful messages to guide the user",
          "Start simple, then add more features"
        ]}
        variant="green"
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these important points about taking input:
          • Scanner is your friend for reading input
          • Different methods for different types of input
          • Always show clear prompts before asking for input
          • Close Scanner when you're done
          • Handle invalid input gracefully
        `}
        variant="green"
      />
    </div>
  );
};

export default TakingInputInJava;
