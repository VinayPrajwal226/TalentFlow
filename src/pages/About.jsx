import React from "react";


const About = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 flex flex-col items-center py-16 px-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          About TalentFlow
        </h1>


        <p className="text-lg leading-relaxed mb-10 text-gray-300">
          <strong className="text-indigo-400">TalentFlow</strong> is a modern hiring platform designed to help
          HR teams efficiently manage <strong className="text-gray-100">Jobs</strong>,{" "}
          <strong className="text-gray-100">Candidates</strong>, and <strong className="text-gray-100">Assessments</strong> — all
          within a sleek, interactive React interface. Built entirely on the
          front end using <strong className="text-indigo-400">React</strong>, it simulates real-world
          recruitment workflows using mock APIs and local data persistence.
        </p>


        <div className="grid sm:grid-cols-2 gap-8 mt-12 text-left">
          <div className="bg-[#161b22] p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-indigo-500/50 border-2 border-transparent transition-all duration-300">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider">
                Mission
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To empower hiring teams with an intuitive and efficient platform
              that simplifies recruitment — from job creation to candidate
              assessment — all while maintaining a great user experience.
            </p>
          </div>


          <div className="bg-[#161b22] p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-purple-500/50 border-2 border-transparent transition-all duration-300">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-400 text-sm font-semibold uppercase tracking-wider">
                Vision
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Our Vision
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We envision a future where recruitment is seamless, data-driven,
              and fully automated — enabling organizations to focus on people,
              not paperwork.
            </p>
          </div>
        </div>


        <div className="mt-12 bg-gradient-to-br from-[#161b22] to-[#1e2633] rounded-2xl p-8 shadow-xl border-2 border-indigo-500/30">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider">
              Technology
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Built for Developers
          </h3>
          <p className="text-gray-300 leading-relaxed">
            TalentFlow is developed using <strong className="text-indigo-400">React</strong>,{" "}
            <strong className="text-purple-400">Tailwind CSS</strong>, and{" "}
            <strong className="text-pink-400">IndexedDB (Dexie)</strong> to simulate server interactions
            and data persistence — demonstrating scalable front-end architecture
            with realistic state management.
          </p>
        </div>


        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
          <div className="bg-[#161b22] p-6 rounded-xl border-2 border-indigo-500/30 hover:border-indigo-500/60 transition-all">
            <div className="text-4xl font-extrabold text-indigo-400 mb-2">100%</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Frontend</div>
          </div>
          
          <div className="bg-[#161b22] p-6 rounded-xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all">
            <div className="text-4xl font-extrabold text-purple-400 mb-2">Modern</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Tech Stack</div>
          </div>
          
          <div className="bg-[#161b22] p-6 rounded-xl border-2 border-pink-500/30 hover:border-pink-500/60 transition-all">
            <div className="text-4xl font-extrabold text-pink-400 mb-2">Scalable</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Architecture</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default About;
