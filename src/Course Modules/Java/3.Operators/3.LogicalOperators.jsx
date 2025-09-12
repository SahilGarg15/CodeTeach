import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';

const LogicalOperators = () => {
  const examples = {
    whatAreLogicalOperators: {
      title: '🤔 What are Logical Operators?',
      code: `public class LogicalOperatorsIntro {
    public static void main(String[] args) {
        // Logical operators help us make decisions based on multiple conditions
        boolean isSunny = true;
        boolean isWarm = true;
        
        // We can check if it's a good day for the beach
        boolean isGoodBeachDay = isSunny && isWarm;
        System.out.println("Is it a good beach day? " + isGoodBeachDay); // true
        
        // We can check if we need an umbrella
        boolean isRaining = false;
        boolean isSnowing = false;
        boolean needUmbrella = isRaining || isSnowing;
        System.out.println("Do I need an umbrella? " + needUmbrella); // false
    }
}`
    },

    andOperator: {
      title: '👥 AND Operator (&&)',
      code: `public class ANDOperatorExample {
    public static void main(String[] args) {
        // AND operator returns true only if BOTH conditions are true
        int age = 25;
        boolean hasLicense = true;
        
        // Can this person drive?
        boolean canDrive = age >= 18 && hasLicense;
        System.out.println("Can drive? " + canDrive); // true
        
        // Multiple conditions with AND
        boolean hasCar = true;
        boolean hasInsurance = true;
        boolean canDriveLegally = age >= 18 && hasLicense && hasCar && hasInsurance;
        System.out.println("Can drive legally? " + canDriveLegally); // true
        
        // Truth table demonstration
        System.out.println("true && true = " + (true && true));     // true
        System.out.println("true && false = " + (true && false));   // false
        System.out.println("false && true = " + (false && true));   // false
        System.out.println("false && false = " + (false && false)); // false
    }
}`
    },

    orOperator: {
      title: '🔀 OR Operator (||)',
      code: `public class OROperatorExample {
    public static void main(String[] args) {
        // OR operator returns true if ANY condition is true
        boolean hasCreditCard = false;
        boolean hasDebitCard = true;
        
        // Can this person pay electronically?
        boolean canPayElectronically = hasCreditCard || hasDebitCard;
        System.out.println("Can pay electronically? " + canPayElectronically); // true
        
        // Multiple conditions with OR
        boolean hasCash = true;
        boolean hasPaypal = false;
        boolean canPay = hasCreditCard || hasDebitCard || hasCash || hasPaypal;
        System.out.println("Can pay somehow? " + canPay); // true
        
        // Truth table demonstration
        System.out.println("true || true = " + (true || true));     // true
        System.out.println("true || false = " + (true || false));   // true
        System.out.println("false || true = " + (false || true));   // true
        System.out.println("false || false = " + (false || false)); // false
    }
}`
    },

    notOperator: {
      title: '❌ NOT Operator (!)',
      code: `public class NOTOperatorExample {
    public static void main(String[] args) {
        // NOT operator reverses the boolean value
        boolean isLoggedIn = true;
        boolean isNotLoggedIn = !isLoggedIn;
        System.out.println("Is not logged in? " + isNotLoggedIn); // false
        
        // Using NOT with conditions
        int age = 15;
        boolean isAdult = age >= 18;
        boolean isMinor = !isAdult;
        System.out.println("Is a minor? " + isMinor); // true
        
        // Double negative
        boolean isNotNotLoggedIn = !!isLoggedIn;
        System.out.println("Is not not logged in? " + isNotNotLoggedIn); // true
        
        // Truth table demonstration
        System.out.println("!true = " + (!true));   // false
        System.out.println("!false = " + (!false)); // true
    }
}`
    },

    complexConditions: {
      title: '🧩 Complex Conditions',
      code: `public class ComplexConditions {
    public static void main(String[] args) {
        int age = 25;
        boolean hasMembership = true;
        boolean isHoliday = false;
        boolean isWeekend = true;
        
        // Complex condition with AND and OR
        boolean canEnterClub = 
            (age >= 21 && hasMembership) || 
            (age >= 25 && isWeekend && !isHoliday);
            
        System.out.println("Can enter club? " + canEnterClub); // true
        
        // Using parentheses to control evaluation order
        boolean condition1 = true;
        boolean condition2 = false;
        boolean condition3 = true;
        
        // These give different results:
        boolean result1 = condition1 && condition2 || condition3;  // true
        boolean result2 = condition1 && (condition2 || condition3); // true
        boolean result3 = (condition1 && condition2) || condition3; // true
        
        System.out.println("Result 1: " + result1);
        System.out.println("Result 2: " + result2);
        System.out.println("Result 3: " + result3);
    }
}`
    },

    practiceQuestions: {
      basic: {
        title: '🎯 Practice: Basic Logical Operations',
        code: `public class BasicLogicalPractice {
    public static void main(String[] args) {
        // TODO: Write code to solve these problems:
        
        // 1. Create two boolean variables and print the result of:
        //    - AND operation
        //    - OR operation
        //    - NOT operation on each variable
        
        // 2. Create a program that checks if a person can vote:
        //    - Must be 18 or older
        //    - Must be a citizen
        //    - Must be registered
        
        // Write your code here
    }
}`
      },
      intermediate: {
        title: '🎯 Practice: Theme Park Rides',
        code: `public class ThemeParkRides {
    public static void main(String[] args) {
        // TODO: Create a program that determines if someone can ride:
        // 1. Roller Coaster:
        //    - Must be at least 4 feet tall
        //    - Must be at least 12 years old
        //    - Must not have a heart condition
        
        // 2. Water Slide:
        //    - Must be at least 48 inches tall
        //    - Must know how to swim
        //    - Must not be afraid of heights
        //    - OR must be accompanied by an adult
        
        // Write your code here
    }
}`
      },
      advanced: {
        title: '🎯 Practice: Game Access System',
        code: `public class GameAccessSystem {
    public static void main(String[] args) {
        // TODO: Create a complex game access system that checks:
        // 1. Player can play ranked matches if:
        //    - Is level 10 or higher
        //    - Has completed tutorial
        //    - Has won at least 5 matches
        //    - Is not currently banned
        
        // 2. Player can enter tournament if:
        //    - Meets ranked matches criteria
        //    - Is in top 100 players OR has tournament pass
        //    - Has stable internet connection
        //    - Has paid entry fee OR has VIP status
        
        // Write your code here
    }
}`
      }
    }
  };

  const basicConcepts = [
    {
      icon: "🧠",
      title: "Understanding Logical Operators",
      content: [
        "Logical operators work with boolean values to make decisions.",
        "They help combine multiple conditions into a single result."
      ],
      code: `boolean result = condition1 && condition2;`
    }
  ];

  const operatorConcepts = [
    {
      icon: "&&",
      title: "AND Operator",
      content: [
        "Returns true only when both conditions are true.",
        "Often used for checking multiple requirements."
      ],
      code: `if (age >= 18 && hasLicense) {
    // Can drive
}`
    },
    {
      icon: "||",
      title: "OR Operator",
      content: [
        "Returns true if at least one condition is true.",
        "Used when any of multiple conditions is acceptable."
      ],
      code: `if (hasCreditCard || hasDebitCard) {
    // Can pay electronically
}`
    },
    {
      icon: "!",
      title: "NOT Operator",
      content: [
        "Reverses the boolean value.",
        "Used to check for the opposite condition."
      ],
      code: `if (!isBlocked) {
    // User can access
}`
    }
  ];

  const advancedConcepts = [
    {
      icon: "🔄",
      title: "Short-Circuit Evaluation",
      content: [
        "&& stops if first condition is false",
        "|| stops if first condition is true",
        "Helps improve performance and avoid errors"
      ],
      code: `// Second part won't execute if obj is null
if (obj != null && obj.getValue() > 0)`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Logical Operators in Java 🧠"
        description="Logical operators help us combine multiple conditions and make complex decisions. They're like the brain of your program, helping it make smart choices! 🤔"
      />

      <ConceptExplanation sections={basicConcepts} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KeyFeatures
          title="AND Operator"
          items={[
            { icon: "&&", text: "Both must be true" },
            { icon: "🎯", text: "Stops on first false" },
            { icon: "📦", text: "Multiple requirements" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="OR Operator"
          items={[
            { icon: "||", text: "One must be true" },
            { icon: "⚡", text: "Stops on first true" },
            { icon: "🔄", text: "Alternative options" }
          ]}
          variant="purple"
        />
        <KeyFeatures
          title="NOT Operator"
          items={[
            { icon: "!", text: "Reverses boolean" },
            { icon: "🔄", text: "Simple inversion" },
            { icon: "✨", text: "Opposite check" }
          ]}
          variant="green"
        />
      </div>

      <ConceptExplanation sections={operatorConcepts} />

      {/* Truth Tables Section - Using KeyFeatures in a different way */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeyFeatures
          title="AND Truth Table"
          items={[
            { icon: "T+T", text: "= True" },
            { icon: "T+F", text: "= False" },
            { icon: "F+T", text: "= False" },
            { icon: "F+F", text: "= False" }
          ]}
          variant="blue"
        />
        <KeyFeatures
          title="OR Truth Table"
          items={[
            { icon: "T+T", text: "= True" },
            { icon: "T+F", text: "= True" },
            { icon: "F+T", text: "= True" },
            { icon: "F+F", text: "= False" }
          ]}
          variant="purple"
        />
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Examples 💡</h2>
        <CodeSnippet {...examples.whatAreLogicalOperators} />
        <CodeSnippet {...examples.andOperator} />
        <CodeSnippet {...examples.orOperator} />
        <CodeSnippet {...examples.notOperator} />
        <CodeSnippet {...examples.complexConditions} />
      </section>

      <ConceptExplanation sections={advancedConcepts} />

      <MistakesToAvoid
        title="Common Mistakes"
        mistakes={[
          "Forgetting parentheses around complex conditions",
          "Confusing && (AND) with || (OR)",
          "Not considering all possible combinations",
          "Incorrect order of operations"
        ]}
        alternatives={[
          "Use parentheses to make order explicit",
          "Break complex conditions into smaller parts",
          "Test all possible combinations",
          "Use meaningful variable names for clarity"
        ]}
      />

      <HandsOn
        title="Basic Practice 🎯"
        description="Start with basic logical operations and simple combinations"
        defaultCode={examples.practiceQuestions.basic.code}
      />

      <HandsOn
        title="Intermediate Practice 🎯"
        description="Apply logical operators to real-world scenarios"
        defaultCode={examples.practiceQuestions.intermediate.code}
      />

      <HandsOn
        title="Advanced Practice 🎯"
        description="Master complex combinations of logical operators"
        defaultCode={examples.practiceQuestions.advanced.code}
      />

      <ImportantNote
        title="Practice Tips"
        points={[
          "Start with the basic practice and work your way up",
          "Try to solve each problem without looking at solutions",
          "Test your code with different input combinations",
          "Challenge yourself to make the conditions more complex"
        ]}
        variant="yellow"
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Remember these essential points about logical operators:
          • AND (&&) requires both conditions to be true
          • OR (||) requires at least one condition to be true
          • NOT (!) reverses the boolean value
          • Use parentheses for complex conditions
          • Consider short-circuit evaluation for efficiency
        `}
        variant="green"
      />
    </div>
  );
};

export default LogicalOperators;
