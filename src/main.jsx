// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import { ParallaxProvider } from 'react-scroll-parallax';
import { AuthProvider } from './context/AuthContext';
import { db } from './services/db/dexieInstance.js';
import { jobsSeed } from './services/seed/jobsSeed.js';
import { candidatesSeed } from './services/seed/candidateSeed.js';
import { assessmentsSeed } from './services/seed/assessmentsSeed.js';

/**
 * This function seeds the database AND starts the mock worker.
 * It will run on localhost AND on Vercel.
 */
async function initializeApp() {
  try {
    // --- 1. SEEDING LOGIC ---
    await db.transaction('rw', db.jobs, db.candidates, db.assessments, async () => {
      const jobsCount = await db.jobs.count();
      if (jobsCount === 0) {
        console.log('Seeding jobs...');
        await db.jobs.bulkAdd(jobsSeed);
      }

      const candidatesCount = await db.candidates.count();
      if (candidatesCount === 0) {
        console.log('Seeding candidates...');
        
        // --- THIS IS THE CRITICAL BUG FIX ---
        // We remove the 'id' from the seed data so Dexie can auto-increment it.
        const candidatesForDb = candidatesSeed.map(({ id, ...rest }) => rest);
        await db.candidates.bulkAdd(candidatesForDb);
        // ------------------------------------

      }

      const assessmentsCount = await db.assessments.count();
      if (assessmentsCount === 0) {
        console.log('Seeding assessments...');
        await db.assessments.bulkAdd(assessmentsSeed);
      }
    });
    console.log('✅ Database seeding check complete.');

    // --- 2. START MOCK WORKER ---
    const { worker } = await import('./services/mocks/browser');
    await worker.start({
      onUnhandledRequest(req, print) {
        if (req.mode === 'navigate') {
          return;
        }
        print.warning();
      },
    });
    console.log('✅ Mock Service Worker started.');

  } catch (error) {
    console.error('Error during app initialization:', error);
  }

  // --- 3. RENDER THE APP ---
  // This part was missing from your file.
  // This runs after the worker is ready.
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <ParallaxProvider>
          <RouterProvider router={router} />
        </Provider>
      </AuthProvider>
    </StrictMode>
  );
}

// Start the whole process
initializeApp();
