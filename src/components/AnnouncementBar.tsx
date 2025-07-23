const ANNOUNCEMENT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfcc4wO22BuUIp-YHKCnMV26KMpJtqOvjviQY6grNFUmUweRA/viewform";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#5b6638] via-[#8b9b57] to-[#8a9663] text-white px-4 py-2 flex items-center justify-center shadow-md relative z-30">
      <span className="hidden lg:inline mr-4 font-semibold text-sm md:text-base">
        Join the Sewa Green Team! Applications are now open for passionate individuals who want to
        make a difference.
      </span>
      <span className="inline lg:hidden mr-4 font-semibold text-sm">
        Sewa Green Team applications open!
      </span>
      <a
        href={ANNOUNCEMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-[#8a9663] font-bold px-4 py-1 rounded-full shadow hover:bg-[#f3fadd] transition-colors duration-200 text-sm md:text-base"
      >
        Apply Now
      </a>
    </div>
  );
}
