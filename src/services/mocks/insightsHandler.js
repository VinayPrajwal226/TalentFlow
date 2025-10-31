import { jobsDb } from "../db/jobsDb";
import { candidatesDb } from "../db/candidatesDb";
import { assessmentsDb } from "../db/assessmentsDb";
import { http, HttpResponse } from "msw";

export const insightsHandlers = [
  http.get("/api/insights", async () => {
    const jobs = await jobsDb.jobs.toArray();
    const candidates = await candidatesDb.candidates.toArray();
    const assessments = await assessmentsDb.assessments.toArray();

    const topJob =
      jobs.length > 0
        ? jobs.reduce((a, b) => (a.applications > b.applications ? a : b)).title
        : "No jobs yet";

    const responseTime = "0.9s"; 
    const mostApplied =
      jobs.length > 0
        ? jobs.reduce((a, b) =>
            (a.applications || 0) > (b.applications || 0) ? a : b
          ).title
        : "No data";

    const accuracy = `${80 + Math.floor(Math.random() * 20)}%`; 

    return HttpResponse.json({
      topJob,
      responseTime,
      mostApplied,
      accuracy,
    });
  }),
];
