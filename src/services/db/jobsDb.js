import { db } from "./dexieInstance";
import { candidatesDb } from "./candidatesDb.js";

export const jobsDb = {
   async getAll({ search = "", status = "", page, pageSize } = {}) {
    let collection;
    if (status) { collection = db.jobs.where("status").equals(status); }
    else { collection = db.jobs.toCollection(); }
    let filteredJobs;
    if (search) {
      const s = search.toLowerCase();
      filteredJobs = await collection.filter(
        (job) => job.title.toLowerCase().includes(s) || job.description.toLowerCase().includes(s)
      ).toArray();
    } else { filteredJobs = await collection.toArray(); }
    filteredJobs.sort((a, b) => a.order - b.order);
    const jobsWithCounts = await Promise.all(
      filteredJobs.map(async (job) => {
        const count = await candidatesDb.countByJobId(job.id);
        return { ...job, candidateCount: count };
      })
    );
    const totalCount = jobsWithCounts.length;
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const jobs = jobsWithCounts.slice(offset, offset + pageSize);
      return { jobs, totalCount };
    }
    return { jobs: jobsWithCounts, totalCount };
  },
  async add(job) {
    const count = await db.jobs.count();
    job.order = job.order ?? count + 1;
    await db.jobs.add(job);
    return job;
  },
  async update(id, updates) {
    await db.jobs.update(id, updates);
    return await db.jobs.get(id);
  },
  async getById(id) {
    return await db.jobs.get(id);
  },

  async reorder(fromOrder, toOrder) {
    const tx = db.transaction("rw", db.jobs, async () => {
      const item = await db.jobs.where("order").equals(fromOrder).first();
      const other = await db.jobs.where("order").equals(toOrder).first();
      if (!item) throw new Error("Invalid fromOrder value");
      const updates = [];
      updates.push(db.jobs.update(item.id, { order: toOrder }));
      if (other) {
         updates.push(db.jobs.update(other.id, { order: fromOrder }));
      }
      await Promise.all(updates);
    });
    return tx;
  },

  async bulkUpdateOrder(updates) {
    const tx = db.transaction('rw', db.jobs, async () => {
      const promises = updates.map(update =>
        db.jobs.update(update.id, { order: update.order })
      );
      await Promise.all(promises);
    });
    return tx; 
  },
};