/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { gsap } from "gsap";

const LoadingScreen = ({ onComplete }) => {
  const [counter, setCounter] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const count = setInterval(() => {
      setCounter((counter) => {
        if (counter < 100) {
          return counter + 1;
        } else {
          clearInterval(count);
          reveal();
          return 100;
        }
      });
    }, 25);

    return () => clearInterval(count);
  }, []);

  const reveal = () => {
    const t1 = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 200);
      },
    });

    t1.to(".follow", {
      width: "100%",
      ease: "expo.inOut",
      duration: 1.2,
      delay: 0.7,
    })
      .to(".hide", { opacity: 0, duration: 0.3 })
      .to(".hide", { display: "none", duration: 0.3 })
      .to(".follow", {
        height: "100%",
        ease: "expo.inOut",
        duration: 0.7,
      })
      .to(".sweep", {
        x: "0%",
        ease: "expo.inOut",
        duration: 0.6,
      })
      .to(".content", {
        width: "100%",
        ease: "expo.inOut",
        duration: 0,
      })
      .to(".portfolio-content", {
        opacity: 1,
        duration: 0,
      })
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-9999 w-screen h-screen text-black">
      <div className="h-full w-full bg-[#101318] flex justify-center items-center">
        <div className="follow absolute bg-[#25c5c5] h-0.5 w-0 left-0 top-1/2 -translate-y-1/2 z-20"></div>
        <div className="sweep absolute inset-0 bg-[#101318] translate-x-full z-30"></div>
        <div
          className="hide absolute left-0 bg-white h-0.5 top-1/2 -translate-y-1/2"
          style={{ width: `${counter}%` }}
        ></div>
        <p className="hide absolute text-white text-4xl sm:text-6xl md:text-8xl font-medium -translate-y-4">
          {counter}%
        </p>
      </div>
      <div className="content fixed inset-y-0 left-0 w-0 bg-[#101318] z-10 overflow-hidden">
        <div className="portfolio-content opacity-0 h-full"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;