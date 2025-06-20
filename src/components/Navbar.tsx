import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Initiatives', path: '/initiatives' },
  { name: 'Get Involved', path: '/get-involved' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (path: string) =>
    `relative transition-all duration-300 ${
      pathname === path
        ? 'text-[#8a9663] font-semibold'
        : 'text-[#5f6743] hover:text-[#b87539]'
    }`;

  const loginLinkClass =
    'bg-[#8a9663] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-[#6f7c50] transition-all duration-300';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-md' : 'bg-white/80'
      } backdrop-blur-md border-b border-white/30`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 text-2xl font-extrabold text-[#8a9663] tracking-tight hover:scale-105 transition-transform duration-300"
        >
          <img
            src="/SGT_logo.png"
            alt="SGT logo"
            className="w-8 h-8 object-contain"
          />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Sewa Green Team
          </motion.span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-base font-medium items-center">
          {routes.map(({ name, path }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              {name}
              {pathname === path && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#b87539] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          ))}
          <Link to="/get-involved?login=true" className={loginLinkClass}>
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#8a9663] hover:scale-110 transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-lg shadow-inner border-t border-white/30"
          >
            <div className="px-6 py-4 space-y-4 text-lg font-medium flex flex-col">
              {routes.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={linkClass(path)}
                >
                  {name}
                </Link>
              ))}
              <Link
                to="/get-involved?login=true"
                onClick={() => setIsOpen(false)}
                className={`${loginLinkClass} text-center`}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
