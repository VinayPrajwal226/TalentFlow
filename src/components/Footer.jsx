import React from "react";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 relative overflow-hidden">
     
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                TalentFlow
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
Streamline your recruitment process with advanced technology.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Trusted by 3,500+ companies</span>
            </div>
          </div>


          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></div>
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="/jobs" className="text-sm text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Jobs
                </a>
              </li>
              <li>
                <a href="/candidates" className="text-sm text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Candidates
                </a>
              </li>
              <li>
                <a href="/assessments" className="text-sm text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Assessments
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="/insights" className="text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Insights
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-violet-500 to-transparent"></div>
              Connect
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow us for updates and insights
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-gray-500 transition-all duration-300 transform group-hover:scale-110">
                  <FaGithub className="text-xl text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500 transition-all duration-300 transform group-hover:scale-110">
                  <FaLinkedin className="text-xl text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </a>
              <a 
                href="https://talentflow.app" 
                target="_blank" 
                rel="noreferrer" 
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-emerald-500 transition-all duration-300 transform group-hover:scale-110">
                  <FaGlobe className="text-xl text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} TalentFlow. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-700">|</span>
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <span className="text-slate-700">|</span>
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Cookie Policy
            </a>
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
