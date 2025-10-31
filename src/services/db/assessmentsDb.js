import { db } from "./dexieInstance";

export const assessmentsDb = {
  async getByJob(jobId) {
    return await db.assessments.where({ jobId }).first();
  },
  async save(jobId, data) {
    const existing = await db.assessments.where({ jobId }).first();
    if (existing) {
      await db.assessments.update(existing.id, { data });
      return await db.assessments.get(existing.id);
    } else {
      const id = await db.assessments.add({ jobId, data });
      return await db.assessments.get(id);
    }
  },
  async submitResponse(jobId, response) {
    const existing = await db.assessments.where({ jobId }).first();
    if (!existing) {
      console.error("Attempted to submit to non-existent assessment");
      return null;
    }
    const responses = existing.data.responses || [];
    responses.push(response);
    await db.assessments.update(existing.id, {
      data: { ...existing.data, responses },
    });
    return await db.assessments.get(existing.id);
  },
  async getTotalResponses() {
    const allAssessments = await db.assessments.toArray();
    const total = allAssessments.reduce((sum, assessment) => {
      return sum + (assessment.data?.responses?.length || 0);
    }, 0);
    return total;
  },

  async getDashboardStats() {
    const allJobs = await db.jobs.toArray();
    const allAssessments = await db.assessments.toArray();
    
    const assessmentMap = new Map(allAssessments.map(a => [a.jobId, a]));
    const jobsMap = new Map(allJobs.map(j => [j.id, j]));

    const totalAssessments = allAssessments.length;

    let completedAssessments = 0;
    for (const assessment of allAssessments) {
      const job = jobsMap.get(assessment.jobId);
      if (job && job.status === 'archived') {
        completedAssessments++;
      }
    }
    const totalResponses = allAssessments.reduce((sum, assessment) => {
      return sum + (assessment.data?.responses?.length || 0);
    }, 0);

    return {
      totalAssessments,
      completedAssessments,
      totalResponses,
    };
  },
  async getJobsOverview() {
    const activeJobs = await db.jobs.where("status").equals("active").toArray();
    const allAssessments = await db.assessments.toArray();
    const assessmentMap = new Map(allAssessments.map(a => [a.jobId, a]));
    const overview = activeJobs.map((job) => {
      const assessment = assessmentMap.get(job.id);
      return {
        id: job.id, 
        title: job.title, 
        hasAssessment: !!assessment,
        assessmentTitle: assessment ? assessment.data?.title : null,
      };
    });

    return overview;
  },
};