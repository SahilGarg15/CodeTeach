import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Code, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const slideInVariants = {
  hidden: (direction) => ({ opacity: 0, x: direction === 'left' ? -20 : 20 }),
  visible: { opacity: 1, x: 0 }
};

const CodeBlock = memo(() => (
  <pre className="text-white white:text-white overflow-x-auto">
    <code>
      <span className="text-blue-400">function</span>{' '}
      <span className="text-green-400">learnToCode</span>() {'{'}
      {'\n  '}
      <span className="text-blue-400">const</span> skills = [
      <span className="text-orange-400">'HTML'</span>,{' '}
      <span className="text-orange-400">'CSS'</span>,{' '}
      <span className="text-orange-400">'JavaScript'</span>
      ];
      {'\n  '}
      <span className="text-blue-400">const</span> you ={' '}
      <span className="text-blue-400">new</span>{' '}
      <span className="text-green-400">Developer</span>();
      {'\n\n  '}
      skills.<span className="text-yellow-400">forEach</span>(
      <span className="text-purple-400">skill</span> =&gt; {'{'}
      {'\n    '}
      you.<span className="text-yellow-400">learn</span>(
      <span className="text-purple-400">skill</span>);
      {'\n  '}
      {'}'});
      {'\n\n  '}
      <span className="text-blue-400">return</span> you.
      <span className="text-yellow-400">becomeAwesome</span>();
      {'\n'}
      {'}'}
      {'\n\n'}
      <span className="text-green-400">learnToCode</span>();
    </code>
  </pre>
));

const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <motion.div
    variants={fadeInVariants}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
  >
    <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </motion.div>
));

const FEATURES = [
  { icon: Code, title: "Interactive Coding", description: "Learn by doing with our hands-on coding exercises" },
  { icon: Users, title: "Expert Mentorship", description: "Get guidance from industry professionals" },
  { icon: Zap, title: "Fast-Track Learning", description: "Accelerate your career with our focused curriculum" }
];

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Add fade out effect before navigation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      navigate('/auth');
      // Reset opacity after navigation
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    }, 300);
  };

  return (
    <section className="py-12 md:py-20 lg:py-32 overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            custom="left"
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left lg:w-1/2"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              Welcome to Our Platform
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Unlock your potential with interactive coding courses and expert guidance. Join thousands of developers transforming their careers through our innovative learning platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </motion.div>

          <motion.div 
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            custom="right"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 w-full max-w-lg mx-auto"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 2, 0, -2, 0],
                  scale: [1, 1.01, 1, 1.01, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="bg-gray-900 rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700"
              >
                <CodeBlock />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute -bottom-6 -left-6 bg-gray-900 rounded-full p-4 shadow-lg border border-gray-700"
              >
                <Code className="h-8 w-8 text-blue-400" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute -top-6 -right-6 bg-gray-900 rounded-full p-4 shadow-lg border border-gray-700"
              >
                <Users className="h-8 w-8 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Why Choose Us?</h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={fadeInVariants}
          >
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Hero);

