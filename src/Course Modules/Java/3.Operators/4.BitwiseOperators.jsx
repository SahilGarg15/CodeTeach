import React from 'react';
import CodeSnippet from '../../../Frontend/Components/Code Components/CodeSnippet';
import Summary from '../../../Frontend/Components/Interface Components/ReadingArea/summary';
import KeyFeatures from '../../../Frontend/Components/Interface Components/ReadingArea/KeyFeatures';
import ImportantNote from '../../../Frontend/Components/Interface Components/ReadingArea/importantnote';
import HandsOn from '../../../Frontend/Components/Interface Components/ReadingArea/handson';
import ConceptExplanation from '../../../Frontend/Components/Interface Components/ReadingArea/ConceptExplanation';
import MistakesToAvoid from '../../../Frontend/Components/Interface Components/ReadingArea/Mistakestoavoid';
import BinaryVisualization from '../../../Frontend/Components/Interface Components/ReadingArea/BinaryVisualization';

const BitwiseOperators = () => {
  const examples = {
    binaryBasics: {
      title: '🔢 Understanding Binary Numbers',
      code: `public class BinaryNumbers {
    public static void main(String[] args) {
        // In computers, numbers are stored in binary (base-2)
        // Each position represents a power of 2
        // Example: Converting 10 to binary
        
        int number = 10;  // In binary: 1010
        // 1    0    1    0
        // 8    4    2    1
        // 8 + 0 + 2 + 0 = 10
        
        // Java has a built-in method to see binary representation
        System.out.println("10 in binary: " + Integer.toBinaryString(number));
        
        // We can also create numbers using binary literals
        int binaryNumber = 0b1010; // Same as decimal 10
        System.out.println("Binary 1010 as decimal: " + binaryNumber);
    }
}`
    },

    bitwiseAND: {
      title: '🤝 Bitwise AND (&)',
      code: `public class BitwiseAND {
    public static void main(String[] args) {
        // Bitwise AND (&) compares each bit position:
        // 1 & 1 = 1 (true & true = true)
        // 1 & 0 = 0 (true & false = false)
        // 0 & 1 = 0 (false & true = false)
        // 0 & 0 = 0 (false & false = false)
        
        int a = 12;  // Binary: 1100
        int b = 10;  // Binary: 1010
        int result = a & b;  // Binary: 1000 (Decimal: 8)
        
        System.out.println("Binary representation:");
        System.out.println("a     = " + Integer.toBinaryString(a));   // 1100
        System.out.println("b     = " + Integer.toBinaryString(b));   // 1010
        System.out.println("a & b = " + Integer.toBinaryString(result)); // 1000
        
        System.out.println("\\nDecimal result:");
        System.out.println("12 & 10 = " + result); // 8
        
        // Common use: Checking if a number is even/odd
        int number = 25;
        boolean isEven = (number & 1) == 0;
        System.out.println("\\nIs 25 even? " + isEven); // false
    }
}`
    },

    bitwiseOR: {
      title: '🔗 Bitwise OR (|)',
      code: `public class BitwiseOR {
    public static void main(String[] args) {
        // Bitwise OR (|) compares each bit position:
        // 1 | 1 = 1 (true | true = true)
        // 1 | 0 = 1 (true | false = true)
        // 0 | 1 = 1 (false | true = true)
        // 0 | 0 = 0 (false | false = false)
        
        int a = 12;  // Binary: 1100
        int b = 10;  // Binary: 1010
        int result = a | b;  // Binary: 1110 (Decimal: 14)
        
        System.out.println("Binary representation:");
        System.out.println("a     = " + Integer.toBinaryString(a));   // 1100
        System.out.println("b     = " + Integer.toBinaryString(b));   // 1010
        System.out.println("a | b = " + Integer.toBinaryString(result)); // 1110
        
        System.out.println("\\nDecimal result:");
        System.out.println("12 | 10 = " + result); // 14
        
        // Common use: Setting a flag bit
        int permissions = 0;        // No permissions: 0000
        int READ = 4;              // Read permission:  0100
        int WRITE = 2;             // Write permission: 0010
        
        // Grant read and write permissions
        permissions = permissions | READ | WRITE;  // 0110
        System.out.println("\\nPermissions: " + Integer.toBinaryString(permissions));
    }
}`
    },

    practiceBasic: {
      title: '🎯 Practice: Basic Bit Operations',
      code: `public class BitOperationsPractice {
    public static void main(String[] args) {
        // TODO: Practice these basic operations
        
        // 1. Convert these numbers to binary (use Integer.toBinaryString())
        int num1 = 15;
        int num2 = 7;
        
        // 2. Perform AND, OR operations and print results in both binary and decimal
        
        // 3. Try to determine if numbers are even or odd using bitwise AND
        
        // Write your code here
    }
}`
    },

    practiceIntermediate: {
      title: '🎯 Practice: Permission System',
      code: `public class PermissionSystem {
    public static void main(String[] args) {
        // TODO: Create a file permission system
        // Use bits to represent: READ (4), WRITE (2), EXECUTE (1)
        
        // 1. Create variables for different permission combinations
        
        // 2. Write methods to:
        //    - Add a permission
        //    - Remove a permission
        //    - Check if a permission exists
        
        // 3. Test your system with different combinations
        
        // Write your code here
    }
}`
    }
  };

  const conceptSections = [
    {
      icon: "🔢",
      title: "Understanding Binary",
      content: [
        "In computers, numbers are stored in binary (base-2) format.",
        "Each position represents a power of 2 (8, 4, 2, 1)."
      ],
      code: `int number = 10;  // Binary: 1010
// 1    0    1    0
// 8    4    2    1
// 8 + 0 + 2 + 0 = 10`
    },
    {
      icon: "⚡",
      title: "Basic Operations",
      content: [
        "Bitwise operators work on individual bits of numbers.",
        "Common operations include AND (&), OR (|), XOR (^), and NOT (~)."
      ],
      code: `int a = 12;  // 1100
int b = 10;  // 1010
int result = a & b;  // 1000 (8)`
    }
  ];

  const operatorFeatures = [
    { icon: "&", text: "Bitwise AND" },
    { icon: "|", text: "Bitwise OR" },
    { icon: "^", text: "Bitwise XOR" },
    { icon: "~", text: "Bitwise NOT" }
  ];

  const shiftFeatures = [
    { icon: "<<", text: "Left shift" },
    { icon: ">>", text: "Right shift" },
    { icon: ">>>", text: "Unsigned right shift" }
  ];

  const useCases = [
    { icon: "🎯", text: "Flag manipulation" },
    { icon: "⚡", text: "Fast multiplication/division" },
    { icon: "🔒", text: "Memory optimization" },
    { icon: "🔐", text: "Cryptography" }
  ];

  const binaryExamples = [
    {
      label: "5 in binary",
      bits: [0,1,0,1]
    },
    {
      label: "3 in binary",
      bits: [0,0,1,1]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Summary 
        title="Bitwise Operators in Java 🔓"
        description="Bitwise operators work at the bit level, manipulating individual bits in binary numbers. They're essential for low-level programming, optimization, and working with flags! 🚀"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KeyFeatures
          title="Basic Operators"
          items={operatorFeatures}
          variant="blue"
        />
        <KeyFeatures
          title="Shift Operators"
          items={shiftFeatures}
          variant="purple"
        />
        <KeyFeatures
          title="Common Uses"
          items={useCases}
          variant="green"
        />
      </div>

      <BinaryVisualization 
        title="Binary Visualization 👀"
        numbers={binaryExamples}
      />

      <ConceptExplanation sections={conceptSections} />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">See It In Action! 🚀</h2>
        <CodeSnippet {...examples.binaryBasics} />
        <CodeSnippet {...examples.bitwiseAND} />
        <CodeSnippet {...examples.bitwiseOR} />
      </section>

      <MistakesToAvoid
        title="Watch Out For These!"
        mistakes={[
          "Confusing bitwise operators (&, |, ^) with logical operators (&&, ||)",
          "Forgetting that shift operations depend on the number's type",
          "Not considering sign bits when using right shift",
          "Overflow when shifting too many positions"
        ]}
        alternatives={[
          "Use clear variable names to indicate bitwise operations",
          "Comment your code when using complex bit manipulations",
          "Consider using utility methods for complex bit operations",
          "Test with different input values"
        ]}
      />

      <HandsOn
        title="Let's Practice! 💪"
        description="Practice basic bit operations to solidify your understanding"
        defaultCode={examples.practiceBasic.code}
      />

      <HandsOn
        title="Advanced Practice! 🎯"
        description="Create a file permission system using bitwise operators"
        defaultCode={examples.practiceIntermediate.code}
      />

      <Summary 
        title="Key Takeaways 📝"
        description={`
          Bitwise operators provide powerful tools for low-level manipulation:
          • AND (&) sets bit to 1 only if both bits are 1
          • OR (|) sets bit to 1 if either bit is 1
          • XOR (^) sets bit to 1 if bits are different
          • NOT (~) inverts all bits
          • Left shift (<<) multiplies by 2 for each position
          • Right shift (>>) divides by 2 for each position
        `}
        variant="green"
      />
    </div>
  );
};

export default BitwiseOperators;
