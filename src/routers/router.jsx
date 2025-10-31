import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import Candidates from "../pages/Candidates"; 
import CandidateProfile from "../pages/CandidateProfile"; 
import CandidateKanban from "../pages/CandidateKanban";
import Assessments from "../pages/Assessments";
import AssessmentBuilder from "../pages/AssessmentBuilder";
import AssessmentFormPage from "../pages/AssessmentFormPage";
import AIInsights from "../pages/AIInsights"; 
import About from "../pages/About";
import Job from "../pages/Job";
import JobsAdmin from "../pages/JobsAdmin";
import JobCreate from "../pages/JobCreate"; 
import JobEdit from "../pages/JobEdit";
import JobAdmin from "../pages/JobAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <Job /> },
      
      { path: "candidates", element: <Candidates /> }, 
      { path: "candidates/:id", element: <CandidateProfile /> }, 
      { path: "candidates/list", element: <Candidates /> }, 
      
      { path: "assessments", element: <Assessments /> },
      { path: "assessments/:jobId/build", element: <AssessmentBuilder /> },
      { path: "assessments/:jobId/take", element: <AssessmentFormPage /> },
      
      { path: "insights", element: <AIInsights /> },
      
      { path: "admin/jobs", element: <JobsAdmin /> },
      { path: "ajobs/:id", element: <JobAdmin /> },
      { path: "admin/jobs/new", element: <JobCreate /> },
      { path: "admin/jobs/:id/edit", element: <JobEdit /> },
    ],
  },
]);

export default router;