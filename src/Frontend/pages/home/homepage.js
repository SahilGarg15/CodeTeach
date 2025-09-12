import React from 'react';
import Header from '../../Components/Header'
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import Footer from '../../Components/Footer'
import { ThemeProvider } from '../../Components/ThemeProvider';


function homepage() {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Header />
          <main className="pt-16">
            <Hero />
            <Features />
            <CallToAction />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
  
  export default homepage;
