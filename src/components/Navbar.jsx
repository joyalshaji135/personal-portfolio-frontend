import { useEffect, useState, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const sections = ["about", "experience", "stack", "projects", "contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDevDocPage, setIsDevDocPage] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    // Check if we're on the dev doc page
    setIsDevDocPage(window.location.pathname === '/dev-doc');
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 20);

      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true);
        setMobileMenuOpen(false); 
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isDevDocPage) return; // Skip observer on dev doc page

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isDevDocPage]);

  const scrollToTop = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const el = document.getElementById(id);
    if (!el) return;

    const NAVBAR_HEIGHT = mobileMenuOpen ? 80 : 80; 
    const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  // If on dev doc page, show simplified navbar
  if (isDevDocPage) {
    return (
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-20
          px-4 sm:px-8 md:px-15 flex justify-between items-center font-mono
          transition-all duration-300 ease-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${
            scrolled
              ? "bg-[#101318]/80 backdrop-blur border-b border-[#27CBCB]/20 shadow-[0_8px_30px_rgba(39,203,203,0.15)]"
              : "bg-transparent"
          }
        `}
      >
        <Link to="/">
          <h1 className="text-xl sm:text-2xl font-bold cursor-pointer text-gray-400 hover:text-[#27CBCB] transition-colors">
            <pre className="text-base sm:text-lg md:text-xl">&lt;/joyal&gt;</pre>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/dev-doc" 
            className="flex items-center gap-2 px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Dev Docs</span>
          </Link>
          <Link 
            to="/" 
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Back to Portfolio
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-20
          px-4 sm:px-8 md:px-15 flex justify-between items-center font-mono
          transition-all duration-300 ease-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${
            scrolled
              ? "bg-[#101318]/80 backdrop-blur border-b border-[#27CBCB]/20 shadow-[0_8px_30px_rgba(39,203,203,0.15)]"
              : "bg-transparent"
          }
        `}
      >
        <a href="#top" onClick={scrollToTop}>
          <h1 className="text-xl sm:text-2xl font-bold cursor-pointer text-gray-400 hover:text-[#27CBCB] transition-colors">
            <pre className="text-base sm:text-lg md:text-xl">&lt;/joyal&gt;</pre>
          </h1>
        </a>
        <div className="hidden md:flex items-center space-x-5 text-lg">
          {sections.map((item) => {
            const isActive = active === item;

            return (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => scrollToSection(item, e)}
                className={`relative px-2 py-1 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "text-[#27CBCB]"
                      : "text-gray-400 hover:text-[#27CBCB]"
                  }
                `}
              >
                /{item}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-[#27CBCB]
                    transition-all duration-300
                    ${isActive ? "w-full" : "w-0"}
                  `}
                />
              </a>
            );
          })}
          <Link 
            to="/dev-doc" 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Dev Docs</span>
          </Link>
        </div>
        <button
          className="md:hidden text-gray-400 hover:text-[#27CBCB] transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>
      <div
        className={`fixed top-0 left-0 w-full h-screen z-40 bg-[#101318]/95 backdrop-blur-md
          transition-all duration-300 ease-out md:hidden
          ${mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="h-20"></div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] space-y-8">
          {sections.map((item) => {
            const isActive = active === item;
            return (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => scrollToSection(item, e)}
                className={`text-2xl font-mono transition-all duration-300
                  ${
                    isActive
                      ? "text-[#27CBCB] scale-110"
                      : "text-gray-400 hover:text-[#27CBCB] hover:scale-105"
                  }
                `}
              >
                /{item}
                {isActive && (
                  <span className="block mt-1 mx-auto w-1/2 h-0.5 bg-[#27CBCB] rounded-full"></span>
                )}
              </a>
            );
          })}
          <Link 
            to="/dev-doc" 
            className="flex items-center gap-2 px-4 py-2 bg-[#27CBCB]/10 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/20 transition-colors text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen className="w-5 h-5" />
            Dev Docs
          </Link>
          <button
            className="mt-4 text-gray-400 hover:text-[#27CBCB] transition-colors text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Close Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;