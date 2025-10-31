import { faker } from "@faker-js/faker";

const jobTitles = [
  "Software Engineer", 
  "QA Engineer", 
  "Product Manager", 
  "UX/UI Designer", 
  "Data Scientist", 
  "DevOps Engineer", 
  "Frontend Developer", 
  "Backend Developer"
];

const allTags = [
  "React", 
  "Vue", 
  "Angular", 
  "Python", 
  "Node.js", 
  "Remote", 
  "Full-time", 
  "Contract", 
  "Go", 
  "AWS", 
  "Docker"
];

export const jobsSeed = Array.from({ length: 25 }).map((_, i) => ({
  id: faker.string.uuid(),
  title: faker.helpers.arrayElement(jobTitles),
  description: faker.lorem.paragraphs(3), 
  slug: `job-${i + 1}`,
  status: Math.random() > 0.3 ? "active" : "archived",
  tags: faker.helpers.arrayElements(allTags, faker.number.int({ min: 2, max: 4 })),
  order: i + 1,

  isRemote: faker.datatype.boolean(),
  location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
  salaryMin: faker.number.int({ min: 50, max: 100 }) * 1000,
  salaryMax: faker.number.int({ min: 101, max: 280 }) * 1000,
  requirements: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }).map(() =>
    faker.lorem.sentence()
  ),
}));