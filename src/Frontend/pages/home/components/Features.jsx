import React from 'react';
import { motion } from 'framer-motion';
import { Code, Github, Layers } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Built-in Code Runner',
    description: 'Write, compile, and run code directly in your browser with our powerful integrated development environment.'
  },
  {
    icon: Github,
    title: 'Save Progress on GitHub',
    description: 'Seamlessly sync your projects and progress with your GitHub account, making it easy to track your learning journey.'
  },
  {
    icon: Layers,
    title: 'Modular Exercises',
    description: 'Learn at your own pace with our bite-sized, modular coding exercises designed to reinforce key concepts.'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12"
        >
          Powerful Features to Accelerate Your Learning
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 mb-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <feature.icon size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
