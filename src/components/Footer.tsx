import { FaInstagram, FaLinkedinIn, FaLink, FaExternalLinkAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-tr from-[#8a9663] via-[#858d6a] to-[#8a9663] text-white py-12 px-12 overflow-hidden select-none">
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        {/* Left Text */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide mb-1 select-text text-white">
            Sewa Green Team
          </h2>
          <p className="text-white/80 max-w-xs md:max-w-md leading-relaxed font-light italic">
            Empowering communities to restore and protect the planet — one step at a time.
          </p>
        </div>

        {/* Social Icons */}
        <nav className="flex space-x-6">
          <a
            href="https://www.instagram.com/sewagreenteam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/company/sewa-green-team-sgt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xl"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://linktr.ee/sewagreenteam"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linktree"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xl"
          >
            <FaLink />
          </a>
        </nav>
      </div>

      {/* Bottom Text */}
    <p className="mt-10 text-center text-white/80 text-sm select-text flex items-center justify-center gap-1 flex-wrap">
      © {new Date().getFullYear()} Sewa Green Team | Built with <FaHeart className="inline-block mx-0.5" /> by{" "}
      <span className="font-bold text-white underline underline-offset-2 hover:text-yellow-100 transition-colors duration-200">
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
