import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Stack from "../components/Stack";
import Projects from "../components/Projects";
import Experience from "../components/Experience"; // Add this import
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Background from "../components/ui/Background";

const Portfolio = () => {
  return (
    <div className="relative w-full min-h-screen text-gray-300 overflow-x-hidden">
      <Background />
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="about" className="scroll-mt-10">
        <div className="flex flex-row items-center px-4 sm:px-6 lg:ml-50 mt-25 sm:mt-20 lg:mt-35 p-3 sm:p-5 space-x-3">
          <p className="cursor-pointer text-[#27CBCB] text-sm sm:text-base">/about</p>
          <div className="bg-gray-700 h-0.5 w-full lg:mr-30 rounded-lg" />
        </div>
        <About />
      </section>
      
      {/* Add Experience Section */}
      <section id="experience" className="scroll-mt-10">
        <div className="flex flex-row items-center px-4 sm:px-6 lg:ml-50 mt-12 sm:mt-16 lg:mt-20 p-3 sm:p-5 space-x-3">
          <p className="cursor-pointer text-[#27CBCB] text-sm sm:text-base">/experience</p>
          <div className="bg-gray-700 h-0.5 w-full lg:mr-30 rounded-lg" />
        </div>
        <Experience />
      </section>
      
      <section id="stack" className="scroll-mt-10">
        <div className="flex flex-row items-center px-4 sm:px-6 lg:ml-50 mt-12 sm:mt-16 lg:mt-20 p-3 sm:p-5 space-x-3">
          <p className="cursor-pointer text-[#27CBCB] text-sm sm:text-base">/stack</p>
          <div className="bg-gray-700 h-0.5 w-full lg:mr-30 rounded-lg" />
        </div>
        <Stack />
      </section>
      <section id="projects" className="scroll-mt-10">
        <div className="flex flex-row items-center px-4 sm:px-6 lg:ml-50 mt-12 sm:mt-16 lg:mt-20 p-3 sm:p-5 space-x-3">
          <p className="cursor-pointer text-[#27CBCB] text-sm sm:text-base">/projects</p>
          <div className="bg-gray-700 h-0.5 w-full lg:mr-30 rounded-lg" />
        </div>
        <Projects />
      </section>
      <section id="contact" className="scroll-mt-10">
        <div className="flex flex-row items-center px-4 sm:px-6 lg:ml-50 mt-12 sm:mt-16 lg:mt-20 p-3 sm:p-5 space-x-3">
          <p className="cursor-pointer text-[#27CBCB] text-sm sm:text-base">/contact</p>
          <div className="bg-gray-700 h-0.5 w-full lg:mr-30 rounded-lg" />
        </div>
        <Contact />
      </section>
      <Footer />
    </div>
  );
};

export default Portfolio;