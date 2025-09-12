import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { Github, Linkedin, Mail } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">CodeTeach</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Making coding education accessible to everyone through interactive learning experiences.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          className="mb-16"
          {...fadeInUp}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At CodeTeach, we believe that coding education should be accessible to everyone. 
              Our platform is designed to break down complex programming concepts into digestible, 
              interactive lessons that make learning to code an engaging and enjoyable experience.
            </p>
          </div>
        </motion.section>

        {/* Developer Section */}
        <motion.section 
          className="mb-16"
          {...fadeInUp}
        >
          
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-16"
          {...fadeInUp}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive Learning",
                description: "Learn by doing with our interactive coding exercises and real-time feedback."
              },
              {
                title: "Structured Curriculum",
                description: "Follow our carefully designed curriculum that takes you from basics to advanced concepts."
              },
              {
                title: "Community Support",
                description: "Join our community of learners and get help when you need it."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
