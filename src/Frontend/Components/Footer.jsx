import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
// import { Github, Twitter, Linkedin, Mail, ArrowRight, ExternalLink } from 'lucide-react';

const SocialIcon = memo(({ Icon, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-purple-600/20 dark:hover:bg-purple-400/20 flex items-center justify-center"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
  </motion.a>
));

const FooterSection = memo(({ title, items }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">{title}</h3>
    <ul className="space-y-2 sm:space-y-3">
      {items.map((item) => (
        <li key={item.text}>
          <motion.a 
            href={item.link} 
            className="group flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span>{item.text}</span>
            {/* <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
          </motion.a>
        </li>
      ))}
    </ul>
  </motion.div>
));

const Footer = memo(() => {
  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    // Handle subscribe logic
  }, []);

  const footerSections = {
    'Quick Links': [
      { text: 'Home', link: '/' },
      { text: 'Courses', link: '/courses' },
      { text: 'About Us', link: '/about' },
      { text: 'Contact', link: '/contact' }
    ],
    'Resources': [
      { text: 'Documentation', link: '/docs' },
      { text: 'Blog', link: '/blog' },
      { text: 'Community', link: '/community' },
      { text: 'Support', link: '/support' }
    ]
  };

  // const socialLinks = [
  //   { Icon: Github, link: 'https://github.com/26JATIN' },
  //   { Icon: Twitter, link: 'https://x.com/JatinGupta93145' },
  //   { Icon: Linkedin, link: 'https://www.linkedin.com/in/jatin-gupta-335b08271/' }
  // ];

  return (
    <footer className="relative bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 col-span-2 xs:col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1"
          >
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CodeTeach
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xs">
              Empowering developers with cutting-edge learning experiences and practical skills.
            </p>
            {/* <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map((social, index) => (
                <SocialIcon key={index} {...social} />
              ))}
            </div> */}
          </motion.div>

          <div className="hidden sm:block lg:contents">
            {Object.entries(footerSections).map(([title, items]) => (
              <FooterSection key={title} title={title} items={items} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 sm:space-y-6 col-span-2 xs:col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Newsletter</h3>
            <form className="space-y-2 sm:space-y-3" onSubmit={handleSubscribe}>
              {/* <div className="relative flex items-center">
                <Mail className="absolute left-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full text-sm sm:text-base pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div> */}
              <motion.button
                type="submit"
                className="group w-full flex items-center justify-center bg-purple-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
                {/* <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform" /> */}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Mobile Footer Sections Accordion */}
        <div className="sm:hidden mt-8 space-y-4">
          {Object.entries(footerSections).map(([title, items]) => (
            <details key={title} className="group">
              <summary className="flex items-center justify-between cursor-pointer text-base font-bold text-gray-900 dark:text-white py-2">
                {title}
                <span className="transform group-open:rotate-180 transition-transform">
                  {/* <ArrowRight className="w-4 h-4" /> */}
                </span>
              </summary>
              <div className="mt-2 space-y-2">
                {items.map(item => (
                  <a
                    key={item.text}
                    href={item.link}
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 py-1"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </details>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} CodeTeach. Built with ❤️ for developers
          </p>
        </motion.div>
      </div>
    </footer>
  );
});

export default Footer;

