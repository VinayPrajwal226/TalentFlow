import { db } from "./dexieInstance";

const createTimelineEntry = (message, stage = null) => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  message,
  stage,
});

export const candidatesDb = {
  async getAll({ search = "", stage = "", jobId = "" } = {}) {
    let result = await db.candidates.toArray();

    if (jobId) {
      result = result.filter((candidate) => candidate.jobId === jobId);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(s) ||
          candidate.email.toLowerCase().includes(s)
      );
    }
    if (stage) {
      result = result.filter((candidate) => candidate.stage === stage);
    }
    return result;
  },

  async countByJobId(jobId) {
    return await db.candidates.where({ jobId }).count();
  },

  async getById(id) {
    return await db.candidates.get(id);
  },

  async add(candidate) {
    const newCandidate = {
      ...candidate,
      notes: [],
      timeline: [
        createTimelineEntry("Application submitted", "applied")
      ],
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    return await db.candidates.add(newCandidate);
  },

  async update(id, updates) {
    const candidate = await db.candidates.get(id);
    if (!candidate) throw new Error("Candidate not found");

    let newTimeline = [...(candidate.timeline || [])];

    if (updates.stage && updates.stage !== candidate.stage) {
      newTimeline.push(
        createTimelineEntry(`Moved to ${updates.stage}`, updates.stage)
      );
    }

    const finalUpdates = {
      ...updates,
      timeline: newTimeline,
      lastUpdated: new Date().toISOString(),
    };

    await db.candidates.update(id, finalUpdates);
    return await db.candidates.get(id);
  },

  async addNote(candidateId, noteText) {
    const candidate = await db.candidates.get(candidateId);
    if (!candidate) throw new Error("Candidate not found");

    const newNote = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: noteText,
    };

    const notes = [newNote, ...(candidate.notes || [])]; 
    await db.candidates.update(candidateId, { notes });
    return newNote;
  },
  
  async getTimeline(candidateId) {
    const candidate = await db.candidates.get(candidateId);
    return candidate?.timeline || [];
  },

  async delete(candidateId) {
    return await db.candidates.delete(candidateId);
  },
};