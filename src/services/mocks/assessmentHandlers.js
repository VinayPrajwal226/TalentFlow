import { http, HttpResponse } from 'msw';
import { assessmentsDb } from '../db/assessmentsDb';

export const assessmentHandlers = [
  http.get('/api/assessments/stats', async () => {
    try {
      const stats = await assessmentsDb.getDashboardStats();
      return HttpResponse.json(stats);
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),
  http.get('/api/assessments/overview', async () => {
    try {
      const overview = await assessmentsDb.getJobsOverview();
      return HttpResponse.json({ jobsOverview: overview });
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),
  http.get('/api/assessments/:jobId', async ({ params }) => {
    const { jobId } = params;
    try {
      const assessment = await assessmentsDb.getByJob(jobId);
      if (!assessment) {
        return HttpResponse.json({
          jobId,
          data: { title: "", description: "", sections: [] },
        });
      }
      return HttpResponse.json(assessment);
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),
  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    const { jobId } = params;
    const data = await request.json(); 
    try {
      const savedAssessment = await assessmentsDb.save(jobId, data);
      return HttpResponse.json(savedAssessment);
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),
  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    const { jobId } = params;
    const responseData = await request.json(); 
    try {
      await assessmentsDb.submitResponse(jobId, responseData);
      return HttpResponse.json({ success: true }, { status: 201 });
    } catch (e) {
      return HttpResponse.json({ error: e.message }, { status: 500 });
    }
  }),
];