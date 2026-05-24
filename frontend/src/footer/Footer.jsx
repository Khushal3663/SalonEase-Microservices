import React from "react";
import { GitHub, LinkedIn, Language } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20 border-t-4 border-green-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-500 tracking-tighter">
            SalonEase
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Revolutionizing salon management with seamless booking and real-time
            notifications. Built for efficiency.
          </p>
        </div>

        {/* Quick Links or Tech Stack */}
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Spring Boot & Microservices</li>
            <li>React & Redux Toolkit</li>
            <li>MySQL & Hibernate</li>
          </ul>
        </div>

        {/* Developer Credit */}
        <div className="flex flex-col md:items-end justify-center">
          <p className="text-sm text-gray-400">Architected & Developed by</p>
          <h3 className="text-xl font-semibold text-white">Khushal</h3>

          <div className="flex gap-4 mt-4 text-gray-400">
            <a
              href="https://github.com/Khushal3663"
              target="_blank"
              className="hover:text-green-500 transition-all"
            >
              <GitHub fontSize="small" />
            </a>
            <a
              href="https://linkedin.com/in/khushalmagare"
              target="_blank"
              className="hover:text-green-500 transition-all"
            >
              <LinkedIn fontSize="small" />
            </a>
            <a href="#" className="hover:text-green-500 transition-all">
              <Language fontSize="small" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SalonEase. All rights reserved.
      </div>
    </footer>

    /* <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-green-500">SalonEase</h2>
            <p className="text-gray-400 text-sm">
              Premium Salon Management Solution
            </p>
          </div>

          <div className="mt-5 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-400">
              Handcrafted by{" "}
              <span className="text-white font-medium">Khushal</span>
            </p>
            <div className="flex gap-4 mt-2 justify-center md:justify-end text-gray-500">
              {/* Add links to your LinkedIn or Portfolio here */
    /* <a href="#" className="hover:text-green-500 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer> */
  );
};

export default Footer;
