import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import { candidatesDb } from "../db/candidatesDb";

export const candidatesHandlers = [
  http.get("/api/candidates", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage") || ""; 
    const jobId = url.searchParams.get("jobId");
    
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    const data = await candidatesDb.getAll({
      search,
      stage,
      jobId,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    return HttpResponse.json(data); 
  }),
  http.get("/api/candidates/:id", async ({ params }) => {
    const candidate = await candidatesDb.getById(params.id);
    if (!candidate) {
      return HttpResponse.json({ error: "Candidate not found" }, { status: 404 });
    }
    return HttpResponse.json(candidate);
  }),
  http.post("/api/candidates", async ({ request }) => {
    const data = await request.json();
    const newCandidateData = {
      ...data,
      id: faker.string.uuid(),
      stage: "applied",
    };
    const newCandidate = await candidatesDb.add(newCandidateData);
    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  http.patch("/api/candidates/:id", async ({ params, request }) => {
    const updates = await request.json();
    const { id } = params;
    const updatedCandidate = await candidatesDb.update(id, updates);
    if (!updatedCandidate) {
      return HttpResponse.json({ error: "Candidate not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedCandidate);
  }),

  http.post("/api/candidates/:id/notes", async ({ params, request }) => {
    const { note } = await request.json();
    if (!note) {
      return HttpResponse.json({ error: "Note text is required" }, { status: 400 });
    }
    try {
      const newNote = await candidatesDb.addNote(params.id, note);
      return HttpResponse.json(newNote, { status: 201 });
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 404 });
    }
  }),
  
  http.get("/api/candidates/:id/timeline", async ({ params }) => {
    const timeline = await candidatesDb.getTimeline(params.id);
    return HttpResponse.json(timeline);
  }),

  http.delete("/api/candidates/:id", async ({ params }) => {
    await candidatesDb.delete(params.id);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];