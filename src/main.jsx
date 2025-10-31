// main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import { ParallaxProvider } from 'react-scroll-parallax';
import { AuthProvider } from './context/AuthContext';

// Function to start the app
const startApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <ParallaxProvider>
          <RouterProvider router={router} />
        </ParallaxProvider>
      </AuthProvider>
    </StrictMode>
  );
};

// Check if we are in development
if (process.env.NODE_ENV === 'development') {
  // --- This is all your mock/seed logic ---
  (async () => {
    const { db } = await import('./services/db/dexieInstance.js');
    const { jobsSeed } = await import('./services/seed/jobsSeed.js');
    const { candidatesSeed } = await import('./services/seed/candidateSeed.js');
    const { assessmentsSeed } = await import('./services/seed/assessmentsSeed.js');

    await db.transaction('rw', db.jobs, db.candidates, db.assessments, async () => {
      const jobsCount = await db.jobs.count();
      if (jobsCount === 0) {
        console.log('Seeding jobs...');
        await db.jobs.bulkAdd(jobsSeed);
      }
      // ... rest of your seeding logic
      const candidatesCount = await db.candidates.count();
      if (candidatesCount === 0) {
        console.log('Seeding candidates...');
        await db.candidates.bulkAdd(candidatesSeed);
      }
      const assessmentsCount = await db.assessments.count();
      if (assessmentsCount === 0) {
        console.log('Seeding assessments...');
        await db.assessments.bulkAdd(assessmentsSeed);
      }
    });

    const { worker } = await import('./services/mocks/browser');
    await worker.start({
      onUnhandledRequest(req, print) {
        if (req.mode === 'navigate') {
          return;
        }
        print.warning();
      },
    });

    // Start the app after mocks are ready
    startApp();
  })();
  // ----------------------------------------
} else {
  // In production, just start the app.
  // It will make real API calls.
  startApp();
}
