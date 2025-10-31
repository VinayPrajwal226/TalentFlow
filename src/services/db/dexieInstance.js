import Dexie from "dexie";
import { jobsSeed } from "../seed/jobsSeed";
import { candidatesSeed } from "../seed/candidateSeed";
import { assessmentsSeed } from "../seed/assessmentsSeed";

export const db = new Dexie("TalentFlowDB");

db.version(2).stores({
  jobs: "id, title, slug, status, tags, order",
  candidates: "++id, name, email, stage, jobId, notes",
  assessments: "++id, jobId, data",
});

db.on("populate", async () => {
  await db.jobs.bulkAdd(jobsSeed);
  await db.candidates.bulkAdd(
    candidatesSeed.map(({ id, ...rest }) => rest)
  );
  await db.assessments.bulkAdd(
    assessmentsSeed.map(a => ({
      jobId: a.jobId,
      data: a.data,
    }))
  );
  
  console.log("✅ Database populated with seed data.");
});
