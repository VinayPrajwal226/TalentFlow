import { faker } from "@faker-js/faker";
import { jobsSeed } from "./jobsSeed.js";

const jobIds = jobsSeed.map(job => job.id);
const createFakeResponses = (count) => {
  return Array.from({ length: count }).map(() => ({
      "q-1": "This is a fake answer.",
      "q-2": "Option 1",
      "q-3": 42,
  }));
};
export const assessmentsSeed = Array.from({ length: 5 }).map((_, i) => ({
  jobId: jobIds[i], 
  data: {
    title: `Assessment for ${jobsSeed[i].title}`,
    description: faker.lorem.sentence(),
    questions: Array.from({ length: 10 }).map((_, qIndex) => ({
      id: `q-${qIndex + 1}`,
      question: `${qIndex + 1}. ${faker.lorem.sentence()}`,
      type: faker.helpers.arrayElement([
        "single-choice", 
        "multi-choice", 
        "short-text", 
        "long-text", 
        "numeric"
      ]),
      options: [
        { id: 'opt1', text: 'Option 1' }, 
        { id: 'opt2', text: 'Option 2' }, 
        { id: 'opt3', text: 'Option 3' }
      ],
      required: faker.datatype.boolean(),
    })),
    responses: i < 3 ? createFakeResponses(faker.number.int({ min: 1, max: 5 })) : [],
  },
}));