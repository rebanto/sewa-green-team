import { FaInstagram, FaLinkedinIn, FaLink, FaExternalLinkAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-tr from-green-900 via-green-700 to-green-800 text-green-100 py-12 px-6 overflow-hidden select-none">
      {/* Removed animated leaves */}
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide mb-1 select-text">SEWA Green Team</h2>
          <p className="text-green-200 max-w-xs md:max-w-md leading-relaxed font-light italic">
            Empowering communities to restore and protect the planet — one step at a time.
          </p>
        </div>
        <nav className="flex space-x-6">
          <a
            href="https://www.instagram.com/sewagreenteam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-green-300 hover:text-green-50 transition-colors duration-300 text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/company/sewa-green-team-sgt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-green-300 hover:text-green-50 transition-colors duration-300 text-xl"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://linktr.ee/sewagreenteam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linktree"
            className="text-green-300 hover:text-green-50 transition-colors duration-300 text-xl"
          >
            <FaLink />
          </a>
        </nav>
      </div>
      <p className="mt-10 text-center text-green-200 text-sm select-text">
        © {new Date().getFullYear()} SEWA Green Team | Built with 💚 by
        <span className="font-bold text-green-100 underline underline-offset-2 ml-1 hover:text-white transition-colors duration-200">
          <a
            href="https://www.linkedin.com/company/phoenixtechsolutions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            Phoenix Tech Solutions
            <FaExternalLinkAlt className="inline-block text-xs mb-[2px]" />
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
