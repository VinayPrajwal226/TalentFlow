import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  DocumentCheckIcon, 
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { insightsDb } from "../services/db/insightsDb";

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    if (value === null || value === undefined) return;
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    const duration = 800;
    const incrementTime = 16;
    const step = (end - start) / (duration / incrementTime);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        start = end;
      }
      setDisplayValue(Math.floor(start));
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{isNaN(displayValue) ? 0 : displayValue}</span>;
};


const StatCard = ({ title, value, icon: Icon, color, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
          {isLoading ? (
            <span className="animate-pulse">...</span>
          ) : typeof value === "string" ? (
            value
          ) : (
            <AnimatedNumber value={value ?? 0} />
          )}
        </p>
      </div>
    </div>
  </motion.div>
);


const ActionCard = ({ title, description, icon: Icon, color, to }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color.bg} ${color.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </motion.div>
  </Link>
);


const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: null,
    newCandidates: null,
    totalAssessments: null,
    completedAssessments: null,
    interviewsPending: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);


  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insights, setInsights] = useState([]);
  const [insightMetrics, setInsightMetrics] = useState({
    hiring: null,
    dropout: null,
    conversion: null,
    timeToHire: 0,
    assessment: null,
  });

  const statColors = {
    blue: { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-600" },
    green: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-600" },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/40",
      text: "text-purple-600",
    },
    teal: {
      bg: "bg-teal-100 dark:bg-teal-900/40",
      text: "text-teal-600",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/40",
      text: "text-orange-600",
    },
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      let activeJobsCount = 0,
        newCandidatesCount = 0,
        interviewsPendingCount = 0,
        assessmentsCompletedCount = 0,
        assessmentsTotalCount = 0;
        
      try {
        const jobsRes = await fetch("/api/jobs?status=active");
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          activeJobsCount = jobsData.totalCount || 0;
        }
        const candidatesRes = await fetch("/api/candidates?stage=applied");
        if (candidatesRes.ok) {
          const data = await candidatesRes.json();
          newCandidatesCount = Array.isArray(data)
            ? data.length
            : data.totalCount || (data.candidates ? data.candidates.length : 0);
        }
        const interviewsRes = await fetch("/api/candidates?stage=interview");
        if (interviewsRes.ok) {
          const data = await interviewsRes.json();
          interviewsPendingCount = Array.isArray(data)
            ? data.length
            : data.totalCount || (data.candidates ? data.candidates.length : 0);
        }
        const assessRes = await fetch("/api/assessments/stats");
        if (assessRes.ok) {
          const assessData = await assessRes.json();
          assessmentsTotalCount = assessData.totalAssessments || 0;
          assessmentsCompletedCount = assessData.completedAssessments || 0;
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStats({
          activeJobs: activeJobsCount,
          newCandidates: newCandidatesCount,
          interviewsPending: interviewsPendingCount,
          totalAssessments: assessmentsTotalCount,
          completedAssessments: assessmentsCompletedCount,
        });
        setLoadingStats(false);
      }
    };
    fetchStats();
    loadInsights();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    let activeJobsCount = 0,
      newCandidatesCount = 0,
      interviewsPendingCount = 0,
      assessmentsCompletedCount = 0;
    try {
      const jobsRes = await fetch("/api/jobs?status=active");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        activeJobsCount = jobsData.totalCount || 0;
      }
      const candidatesRes = await fetch("/api/candidates?stage=applied");
      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        newCandidatesCount = Array.isArray(data)
          ? data.length
          : data.totalCount || (data.candidates ? data.candidates.length : 0);
      }
      const interviewsRes = await fetch("/api/candidates?stage=interview");
      if (interviewsRes.ok) {
        const data = await interviewsRes.json();
        interviewsPendingCount = Array.isArray(data)
          ? data.length
          : data.totalCount || (data.candidates ? data.candidates.length : 0);
      }
      const assessRes = await fetch("/api/assessments/stats");
      if (assessRes.ok) {
        const assessData = await assessRes.json();
        assessmentsCompletedCount = assessData.totalCompleted || 0;
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStats({
        activeJobs: activeJobsCount,
        newCandidates: newCandidatesCount,
        interviewsPending: interviewsPendingCount,
        assessmentsCompleted: assessmentsCompletedCount,
      });
      setLoadingStats(false);
    }
  };

  const loadInsights = async () => {
    try {
      setLoadingInsights(true);
      
      const [summary, hiring, dropout, conversion, timeToHire, assessment] = 
        await Promise.all([
          insightsDb.generateInsightsSummary(),
          insightsDb.getHiringMetrics("month"),
          insightsDb.getStageDropoutAnalysis(),
          insightsDb.getConversionRates(),
          insightsDb.getTimeToHire(),
          insightsDb.getAssessmentMetrics(),
        ]);
      
      setInsights(summary);
      setInsightMetrics({ hiring, dropout, conversion, timeToHire, assessment });
    } catch (error) {
      console.error("Error loading insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
   
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            HR Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back to TalentFlow. Here's your weekly overview.
          </p>
        </div>
      </div>

     
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={BriefcaseIcon}
          color={statColors.blue}
          isLoading={loadingStats}
        />
        <StatCard
          title="New Candidates"
          value={stats.newCandidates}
          icon={UserGroupIcon}
          color={statColors.green}
          isLoading={loadingStats}
        />
        <StatCard
          title="Total Assessments"
          value={stats.totalAssessments}
          icon={DocumentDuplicateIcon} 
          color={statColors.purple}
          isLoading={loadingStats}
        />
        <StatCard
          title="Completed Assessments"
          value={
            loadingStats ? null : `${stats.completedAssessments ?? 0}`
          }
          icon={DocumentCheckIcon} 
          color={statColors.teal} 
          isLoading={loadingStats}
        />
        <StatCard
          title="Interviews"
          value={
            loadingStats ? null : `${stats.interviewsPending ?? 0} Pending`
          }
          icon={ChatBubbleBottomCenterTextIcon}
          color={statColors.orange}
          isLoading={loadingStats}
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-14 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Manage Jobs"
          description="Create, edit, and manage job postings"
          icon={BriefcaseIcon}
          color={statColors.blue}
          to="/admin/jobs"
        />
        <ActionCard
          title="Manage Candidates"
          description="View pipeline and candidate details"
          icon={UserGroupIcon}
          color={statColors.green}
          to="/candidates"
        />
        <ActionCard
          title="Manage Assessments"
          description="Build and assign candidate assessments"
          icon={ClipboardDocumentListIcon}
          color={statColors.purple}
          to="/assessments"
        />
      </div>

      
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-14 mb-6">
        Key Insights
      </h2>

      {loadingInsights ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
       
          <div className="mb-8">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                      : insight.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>

       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Hired"
              value={insightMetrics.hiring?.totalHired || 0}
              subtitle="this month"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${insightMetrics.conversion?.conversionRate || 0}%`}
              subtitle={`${insightMetrics.conversion?.totalHired || 0}/${insightMetrics.conversion?.totalApplied || 0} hired`}
            />
            <MetricCard
              title="Avg Time to Hire"
              value={`${insightMetrics.timeToHire} days`}
              subtitle="from application"
            />
            <MetricCard
              title="Assessment Completion"
              value={`${insightMetrics.assessment?.completionRate || 0}%`}
              subtitle={`${insightMetrics.assessment?.totalResponses || 0} responses`}
            />
          </div>

 
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Candidate Stage Distribution
            </h3>
            <div className="space-y-3">
              {insightMetrics.dropout?.stageDistribution &&
                Object.entries(insightMetrics.dropout.stageDistribution).map(([stage, count]) => (
                  <div key={stage} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600 dark:text-gray-400 capitalize">{stage}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full flex items-center justify-end px-2 text-white text-xs font-semibold"
                        style={{
                          width: `${(count / insightMetrics.conversion?.totalApplied * 100) || 0}%`,
                          minWidth: count > 0 ? "40px" : "0",
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

   
          {insightMetrics.hiring?.hiredByRole && Object.keys(insightMetrics.hiring.hiredByRole).length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Hires by Role (This Month)
              </h3>
              <div className="space-y-2">
                {Object.entries(insightMetrics.hiring.hiredByRole)
                  .sort((a, b) => b[1] - a[1])
                  .map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">{role}</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
