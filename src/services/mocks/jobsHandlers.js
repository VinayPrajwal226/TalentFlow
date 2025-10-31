import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import { jobsDb } from "../db/jobsDb";
import { db } from "../db/dexieInstance"; 
export const jobsHandlers = [
  http.get("/api/jobs", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    const jobsData = await jobsDb.getAll({
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    const allAssessments = await db.assessments.toArray();
    const assessmentMap = new Map(allAssessments.map((a) => [a.jobId, true]));

    const jobsWithAssessmentStatus = jobsData.jobs.map((job) => {
      return {
        ...job, 
        hasAssessment: assessmentMap.has(job.id), 
      };
    });

    return HttpResponse.json({
      jobs: jobsWithAssessmentStatus,
      totalCount: jobsData.totalCount,
    });
  }),

  http.get("/api/jobs/:id", async ({ params }) => {
    const id = params.id;
    const job = await jobsDb.getById(id);
    if (!job) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  http.post("/api/jobs", async ({ request }) => {
    const data = await request.json();
    const newJobData = {
      ...data,
      id: faker.string.uuid(),
      slug: data.slug || faker.helpers.slugify(data.title).toLowerCase(),
      status: data.status || "active",
      tags: data.tags || [],
      requirements: data.requirements || [],
    };
    const newJob = await jobsDb.add(newJobData);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch("/api/jobs/reorder", async ({ request }) => {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return HttpResponse.json(
        { error: "Invalid payload: 'updates' array is required." },
        { status: 400 }
      );
    }

    if (Math.random() < 0.08) {
      console.log("Simulating bulk reorder failure...");
      return HttpResponse.json(
        { error: "Simulated server error during bulk update" },
        { status: 500 }
      );
    }

    try {
      await jobsDb.bulkUpdateOrder(updates);
      return HttpResponse.json({ success: true });
    } catch (e) {
      return HttpResponse.json(
        { error: e.message || "Database error" },
        { status: 500 }
      );
    }
  }),
  http.patch("/api/jobs/:id/reorder", async ({ params, request }) => {
    const { fromOrder, toOrder } = await request.json();
    try {
      await jobsDb.reorder(fromOrder, toOrder);
      return HttpResponse.json({ success: true });
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),

  http.patch("/api/jobs/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();

    const updatedJob = await jobsDb.update(id, updates);
    if (!updatedJob) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedJob);
  }),
];