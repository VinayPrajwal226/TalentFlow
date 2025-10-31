import { db } from "./dexieInstance";
import { candidatesDb } from "./candidatesDb";
import { jobsDb } from "./jobsDb";
import { assessmentsDb } from "./assessmentsDb";

export const insightsDb = {
  async getHiringMetrics(timeframe = "month") {
    const allCandidates = await db.candidates.toArray();
    const now = new Date();
    const startDate = new Date();
    
    if (timeframe === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeframe === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const recentCandidates = allCandidates.filter(c => {
      const updateDate = c.lastUpdated ? new Date(c.lastUpdated) : new Date(c.appliedDate);
      return updateDate >= startDate;
    });
    
    const hiredCandidates = recentCandidates.filter(c => c.stage === "hired");
    const hiredCount = hiredCandidates.length;
    
    const hiredByRole = {};
    for (const candidate of hiredCandidates) {
      const jobTitle = candidate.jobTitle || "Unknown Role";
      hiredByRole[jobTitle] = (hiredByRole[jobTitle] || 0) + 1;
    }
    
    return {
      totalHired: hiredCount,
      hiredByRole,
      timeframe,
      recentApplications: recentCandidates.length,
    };
  },
  
  async getStageDropoutAnalysis() {
    const allCandidates = await db.candidates.toArray();
    
    const stageDistribution = {
      applied: 0,
      screen: 0,
      tech: 0,
      offer: 0,
      hired: 0,
      rejected: 0,
    };
    
    allCandidates.forEach(c => {
      if (stageDistribution.hasOwnProperty(c.stage)) {
        stageDistribution[c.stage]++;
      }
    });
    
    const stages = ["applied", "screen", "tech", "offer", "hired"];
    const dropoutRates = {};
    
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];
      const currentCount = stageDistribution[currentStage];
      const nextCount = stageDistribution[nextStage];
      
      if (currentCount > 0) {
        const dropoutRate = ((currentCount - nextCount) / currentCount * 100).toFixed(1);
        dropoutRates[`${currentStage}_to_${nextStage}`] = parseFloat(dropoutRate);
      }
    }
    
    const highestDropout = Object.entries(dropoutRates).reduce(
      (max, [stage, rate]) => rate > max.rate ? { stage: stage.split('_to_')[0], rate } : max,
      { stage: "", rate: 0 }
    );
    
    return {
      stageDistribution,
      dropoutRates,
      highestDropout,
      totalCandidates: allCandidates.length,
    };
  },
  
  async getTimeToHire() {
    const hiredCandidates = await db.candidates
      .where("stage")
      .equals("hired")
      .toArray();
    
    if (hiredCandidates.length === 0) return 0;
    
    const totalDays = hiredCandidates.reduce((sum, candidate) => {
      const applied = new Date(candidate.appliedDate);
      const hired = new Date(candidate.lastUpdated || candidate.appliedDate);
      const days = Math.abs((hired - applied) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    
    return Math.round(totalDays / hiredCandidates.length);
  },
  
  async getConversionRates() {
    const allCandidates = await db.candidates.toArray();
    const totalApplied = allCandidates.length;
    const totalHired = allCandidates.filter(c => c.stage === "hired").length;
    const totalRejected = allCandidates.filter(c => c.stage === "rejected").length;
    
    const conversionRate = totalApplied > 0 
      ? ((totalHired / totalApplied) * 100).toFixed(1)
      : 0;
    
    const rejectionRate = totalApplied > 0
      ? ((totalRejected / totalApplied) * 100).toFixed(1)
      : 0;
    
    return {
      totalApplied,
      totalHired,
      totalRejected,
      conversionRate: parseFloat(conversionRate),
      rejectionRate: parseFloat(rejectionRate),
    };
  },
  
  async getAssessmentMetrics() {
    try {
      const totalResponses = await assessmentsDb.getTotalResponses();
      const allCandidates = await db.candidates.toArray();
      
      const completionRate = allCandidates.length > 0
        ? ((totalResponses / allCandidates.length) * 100).toFixed(1)
        : 0;
      
      return {
        totalResponses,
        completionRate: parseFloat(completionRate),
      };
    } catch (error) {
      return {
        totalResponses: 0,
        completionRate: 0,
      };
    }
  },
  
  async getTopPerformingJobs(limit = 5) {
    const allCandidates = await db.candidates.toArray();
    
    const jobPerformance = {};
    
    allCandidates.forEach(candidate => {
      const jobTitle = candidate.jobTitle || "Unknown Role";
      
      if (!jobPerformance[jobTitle]) {
        jobPerformance[jobTitle] = {
          jobTitle,
          totalCandidates: 0,
          hired: 0,
        };
      }
      
      jobPerformance[jobTitle].totalCandidates++;
      if (candidate.stage === "hired") {
        jobPerformance[jobTitle].hired++;
      }
    });
    
    const performanceArray = Object.values(jobPerformance).map(job => ({
      ...job,
      hireRate: job.totalCandidates > 0 
        ? parseFloat(((job.hired / job.totalCandidates) * 100).toFixed(1))
        : 0,
    }));
    
    return performanceArray
      .filter(j => j.totalCandidates > 0)
      .sort((a, b) => b.hireRate - a.hireRate)
      .slice(0, limit);
  },
  
  async getTopSkills(limit = 10) {
    const hiredCandidates = await db.candidates
      .where("stage")
      .equals("hired")
      .toArray();
    
    const skillCounts = {};
    
    hiredCandidates.forEach(candidate => {
      if (candidate.skills && Array.isArray(candidate.skills)) {
        candidate.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });
    
    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
  
  async getExperienceDistribution() {
    const allCandidates = await db.candidates.toArray();
    
    const distribution = {
      "0-2 years": 0,
      "2-5 years": 0,
      "5-10 years": 0,
      "10+ years": 0,
      "Not specified": 0,
    };
    
    allCandidates.forEach(candidate => {
      if (!candidate.experience) {
        distribution["Not specified"]++;
        return;
      }
      
      const match = candidate.experience.match(/(\d+)/);
      if (match) {
        const years = parseInt(match[1]);
        if (years <= 2) distribution["0-2 years"]++;
        else if (years <= 5) distribution["2-5 years"]++;
        else if (years <= 10) distribution["5-10 years"]++;
        else distribution["10+ years"]++;
      } else {
        distribution["Not specified"]++;
      }
    });
    
    return distribution;
  },
  
  async generateInsightsSummary() {
    const hiring = await this.getHiringMetrics("month");
    const dropout = await this.getStageDropoutAnalysis();
    const timeToHire = await this.getTimeToHire();
    const conversion = await this.getConversionRates();
    const topSkills = await this.getTopSkills(5);
    
    const insights = [];
    
    if (hiring.totalHired > 0) {
      const topRole = Object.entries(hiring.hiredByRole)
        .sort((a, b) => b[1] - a[1])[0];
      
      insights.push({
        type: "success",
        icon: "🎉",
        message: `You hired ${hiring.totalHired} candidate${hiring.totalHired > 1 ? 's' : ''} this month${topRole ? `, with ${topRole[1]} ${topRole[0]} position${topRole[1] > 1 ? 's' : ''} filled` : ''}.`,
      });
    } else {
      insights.push({
        type: "info",
        icon: "📊",
        message: `No candidates were hired this month. You have ${hiring.recentApplications} recent application${hiring.recentApplications !== 1 ? 's' : ''} to review.`,
      });
    }
    
    if (conversion.conversionRate > 0) {
      const trend = conversion.conversionRate >= 15 ? "excellent" 
                  : conversion.conversionRate >= 10 ? "strong" 
                  : conversion.conversionRate >= 5 ? "moderate" 
                  : "needs improvement";
      
      insights.push({
        type: conversion.conversionRate >= 10 ? "success" : "info",
        icon: conversion.conversionRate >= 10 ? "📈" : "📊",
        message: `Your conversion rate is ${conversion.conversionRate}%, showing ${trend} hiring performance across ${conversion.totalApplied} total applications.`,
      });
    }
  
    if (dropout.highestDropout.stage && dropout.highestDropout.rate > 0) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        message: `Candidates drop most at the "${dropout.highestDropout.stage}" stage (${dropout.highestDropout.rate}% dropout rate). Consider reviewing this process.`,
      });
    }
    
    if (timeToHire > 0) {
      const speed = timeToHire < 14 ? "fast" : timeToHire < 30 ? "moderate" : "slow";
      const emoji = timeToHire < 14 ? "⚡" : timeToHire < 30 ? "⏱️" : "🐌";
      
      insights.push({
        type: timeToHire < 30 ? "success" : "warning",
        icon: emoji,
        message: `Average time-to-hire is ${timeToHire} days, which is ${speed} compared to industry standards (14-30 days).`,
      });
    }
    
    const pipelineHealth = dropout.stageDistribution.applied > 0
      ? ((dropout.stageDistribution.screen + dropout.stageDistribution.tech + dropout.stageDistribution.offer) / dropout.stageDistribution.applied * 100).toFixed(0)
      : 0;
    
    if (parseFloat(pipelineHealth) < 30 && dropout.stageDistribution.applied > 10) {
      insights.push({
        type: "warning",
        icon: "🔄",
        message: `Only ${pipelineHealth}% of applicants are progressing past the initial stage. Consider reviewing your screening criteria.`,
      });
    }
    if (topSkills.length > 0) {
      const topSkillNames = topSkills.slice(0, 3).map(s => s.skill).join(", ");
      insights.push({
        type: "info",
        icon: "💡",
        message: `Top skills among hired candidates: ${topSkillNames}. Focus on these skills in your job postings.`,
      });
    }
    
    return insights;
  },
};
