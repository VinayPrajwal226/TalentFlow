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







  await db.transaction('rw', db.jobs, db.candidates, db.assessments, async () => {


    const jobsCount = await db.jobs.count();

    if (jobsCount === 0) {

      console.log('Seeding jobs...');

      await db.jobs.bulkAdd(jobsSeed);

    }



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







createRoot(document.getElementById('root')).render(

  <StrictMode>

    <AuthProvider>

      <ParallaxProvider>

        <RouterProvider router={router} />

      </ParallaxProvider>

    </AuthProvider>

  </StrictMode>

);
