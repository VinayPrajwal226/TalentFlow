import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ChartBarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import heroImage from "/images/heroImage.jpeg";


/* -----------------------
   Count-up Animation
   ----------------------- */
const useCountUp = (target, duration = 1500) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (t) => {
      const progress = Math.min((t - start) / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
};


/* -----------------------
   Floating Avatar
   ----------------------- */
const FloatingAvatar = ({ src, label, x, y, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 140 }}
    className="absolute flex items-center gap-2 backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-2xl px-4 py-2 shadow-2xl"
    style={{ left: x, top: y }}
  >
    <img src={src} alt={label || "avatar"} className="w-10 h-10 rounded-full border-2 border-emerald-400/50 shadow-lg" />
    {label && <span className="text-sm font-bold text-white drop-shadow-lg">{label}</span>}
  </motion.div>
);



const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white min-h-screen flex items-center">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-72 h-72 bg-violet-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center relative z-10">

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Transform
            </span>{" "}
            <span className="text-white">Your Hiring</span>
            <br />
            <span className="text-white">Journey Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 leading-relaxed max-w-xl mb-8"
          >
            Streamline recruitment with{" "}
            <span className="text-emerald-400 font-bold">smart automation</span>,
            intelligent candidate tracking, and data-driven decisions. Join 3,500+ companies
            revolutionizing their hiring process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button
              onClick={() => navigate("/jobs")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
            >
              Learn More
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-2xl shadow-2xl border border-slate-700/50 p-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3 flex-1 border-2 border-slate-600/50 hover:border-emerald-500/50 focus-within:border-emerald-500 rounded-2xl px-4 py-3 bg-slate-900/50 transition-all">
                <MagnifyingGlassIcon className="w-6 h-6 text-emerald-400" />
                <input
                  placeholder="Search roles (e.g., Senior Developer)..."
                  className="outline-none bg-transparent text-base flex-1 text-white placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-3 border-2 border-slate-600/50 hover:border-cyan-500/50 focus-within:border-cyan-500 rounded-2xl px-4 py-3 bg-slate-900/50 transition-all">
                <MapPinIcon className="w-6 h-6 text-cyan-400" />
                <input
                  placeholder="Location..."
                  className="outline-none bg-transparent text-base text-white placeholder-slate-400 w-32"
                />
              </div>
              <button
                onClick={() => navigate("/jobs")}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all"
              >
                Search
              </button>
            </div>
          </motion.div>

  
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <StatCard label="Open Roles" value={12000} suffix="+" color="emerald" />
            <StatCard label="Recruiters" value={8000} suffix="+" color="cyan" />
            <StatCard label="Companies" value={3500} suffix="+" color="violet" />
            <StatCard label="Success Rate" value={98} suffix="%" highlight={true} />
          </motion.div>
        </div>


        <div className="relative lg:block hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20"></div>
            <img
              src={heroImage}
              alt="team"
              className="w-full h-[520px] object-cover"
            />
            <FloatingAvatar src="https://i.pravatar.cc/48?img=12" label="✨ Hired!" x="8%" y="8%" delay={0.25} />
            <FloatingAvatar src="https://i.pravatar.cc/48?img=22" label="📞 Interview" x="60%" y="14%" delay={0.4} />
            <FloatingAvatar src="https://i.pravatar.cc/48?img=33" label="⭐ Shortlisted" x="12%" y="68%" delay={0.5} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};



const StatCard = ({ label, value, suffix, highlight = false, color = "emerald" }) => {
  const counted = useCountUp(value);
  
  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/40 text-emerald-400",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/40 text-cyan-400",
    violet: "from-violet-500/20 to-violet-600/20 border-violet-500/40 text-violet-400",
  };

  return (
    <div className={`flex flex-col items-start p-5 rounded-2xl transition-all backdrop-blur-xl ${
      highlight 
        ? "bg-gradient-to-br from-fuchsia-500/30 to-violet-500/30 border-2 border-fuchsia-500/50 relative shadow-xl shadow-fuchsia-500/20" 
        : `bg-gradient-to-br ${colorMap[color]} border-2`
    }`}>
      {highlight && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full p-2 shadow-lg">
          <RocketLaunchIcon className="w-4 h-4 text-white animate-pulse" />
        </div>
      )}
      <div className={`text-3xl md:text-4xl font-extrabold ${
        highlight ? "text-fuchsia-300" : colorMap[color].split(' ')[3]
      }`}>
        {counted.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">{label}</div>
      {highlight && (
        <div className="text-[11px] text-fuchsia-300 font-bold mt-2 px-2 py-1 bg-fuchsia-500/20 rounded-full">
          VERIFIED
        </div>
      )}
    </div>
  );
};



const FeaturesSection = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      title: "Simplified Hiring",
      description: "Post jobs, track candidates, and hire faster with our intuitive platform designed for modern HR teams.",
      color: "emerald",
    },
    {
      icon: UsersIcon,
      title: "Real-Time Collaboration",
      description: "Work seamlessly with your team, share notes, feedback, and make decisions instantly.",
      color: "cyan",
    },
    {
      icon: ClipboardDocumentListIcon,
      title: "Smart Screening",
      description: "Advanced candidate matching ensures you find the perfect fit for your company culture.",
      color: "violet",
    },
  ];

  const colorClasses = {
    emerald: "from-emerald-600 to-cyan-600",
    cyan: "from-cyan-600 to-sky-600",
    violet: "from-violet-600 to-purple-600",
  };

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl top-20 left-10"></div>
        <div className="absolute w-64 h-64 bg-violet-500/10 rounded-full blur-3xl bottom-20 right-10"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
        >
          <ChartBarIcon className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">FEATURES</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Everything You Need
          </span>
          <br />
          <span className="text-white">To Hire Smarter</span>
        </motion.h2>

        <p className="text-slate-300 text-lg mb-16 max-w-3xl mx-auto">
          Our platform combines cutting-edge technology with intuitive design
          to revolutionize how you discover, evaluate, and hire top talent.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group backdrop-blur-xl bg-slate-800/50 border-2 border-slate-700/50 hover:border-emerald-500/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colorClasses[f.color]} p-4 mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <f.icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const JobOpportunitiesSection = () => {
  const jobs = [
    { 
      id: 1, 
      title: "Product Manager", 
      salary: "$51,000 - $202,000", 
      location: "East Bernadineside, MA", 
      type: "Remote", 
      tags: ["Vue"], 
      applicants: 41,
      status: "active"
    },
    { 
      id: 2, 
      title: "Software Engineer", 
      salary: "$55,000 - $224,000", 
      location: "Lake Woodrowfield, GA", 
      type: "Full-time", 
      tags: ["AWS", "Docker", "Angular", "Go"],
      applicants: 34,
      status: "active"
    },
    { 
      id: 3, 
      title: "UX/UI Designer", 
      salary: "$96,000 - $108,000", 
      location: "Loveland, IN", 
      type: "Full-time", 
      tags: ["Angular", "Vue"],
      applicants: 36,
      status: "archived"
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6"
          >
            <BriefcaseIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">OPPORTUNITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Discover Your Next Role
          </motion.h2>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse curated opportunities from top companies looking for talented individuals like you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 backdrop-blur-xl bg-slate-800/50 border-2 border-slate-700/50 hover:border-emerald-500/50 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative"
            >
              {job.status === "archived" && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                  📦 ARCHIVED
                </div>
              )}
              {job.status === "active" && i === 0 && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                  ✅ ACTIVE
                </div>
              )}

              <h4 className="text-xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                {job.title}
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                {job.type} · {job.location}
              </p>
              <div className="text-2xl font-extrabold text-white mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {job.salary}
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {job.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <UsersIcon className="w-4 h-4" />
                <span>{job.applicants} Applicants</span>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={job.status === "archived"}>
                {job.status === "archived" ? "Archived" : "Apply Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const JobsCTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-5xl md:text-6xl font-extrabold mb-6">
            Ready to Transform<br />Your Hiring?
          </h3>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies using TalentFlow to find, assess, and hire the best talent efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate("/jobs")}
              className="group px-10 py-5 rounded-2xl bg-white text-emerald-700 font-black text-lg shadow-2xl hover:shadow-white/30 hover:scale-110 transition-all duration-300 flex items-center gap-3"
            >
              Start Hiring Today
              <RocketLaunchIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="group px-10 py-5 rounded-2xl border-4 border-white text-white hover:bg-white hover:text-violet-700 font-black text-lg transition-all duration-300 flex items-center gap-3"
            >
              Learn More
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};



const PublicLandingPage = () => (
  <div className="bg-slate-950 text-white">
    <main>
      <HeroSection />
      <FeaturesSection />
      <JobOpportunitiesSection />
      <JobsCTASection />
    </main>
  </div>
);



const Home = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Dashboard /> : <PublicLandingPage />;
};

export default Home;
