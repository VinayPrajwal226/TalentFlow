import { faker } from "@faker-js/faker";
import { jobsSeed } from "./jobsSeed.js"; 

const jobs = jobsSeed.map(job => ({ id: job.id, title: job.title }));
const TOTAL_JOBS = jobs.length;

const allSkills = [
  "React", "Vue", "Angular", "Python", "Node.js", "Go", "AWS", "Docker",
  "JavaScript", "TypeScript", "C++", "Java", "PostgreSQL", "MongoDB"
];

const stages = ["applied", "screen", "interview", "offer", "rejected", "hired"];
const TOTAL_CANDIDATES = 1000;
const GUARANTEED_PER_JOB = 10;

export const candidatesSeed = Array.from({ length: TOTAL_CANDIDATES }).map((_, i) => {
  let job;

  if (i < TOTAL_JOBS * GUARANTEED_PER_JOB) {
    job = jobs[i % TOTAL_JOBS];
  } else {
    job = faker.helpers.arrayElement(jobs);
  }

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    jobId: job.id,
    jobTitle: job.title, 
    stage: stages[faker.number.int({ min: 0, max: stages.length - 1 })],
    notes: [],
    skills: faker.helpers.arrayElements(allSkills, faker.number.int({ min: 2, max: 4 })), 
    experience: `Experienced developer with ${faker.number.int({ min: 1, max: 7 })} years of experience.`, 
    education: faker.person.bio(), 
    phone: faker.phone.number(),
    appliedDate: faker.date.recent({ days: 30 }).toISOString(), 
    lastUpdated: new Date().toISOString(),
    timeline: [ 
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        message: "Application submitted",
        stage: "applied",
      }
    ]
  };
});