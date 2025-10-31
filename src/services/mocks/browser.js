import { setupWorker } from "msw/browser";
import { assessmentHandlers } from "./assessmentHandlers";
import { jobsHandlers } from "./jobsHandlers";
 import { candidatesHandlers } from "./candidatesHandlers";
import { insightsHandlers } from "./insightsHandler";
export const worker = setupWorker(
  ...assessmentHandlers,
  ...jobsHandlers,
  ...candidatesHandlers,
  ...insightsHandlers
);
