# TalentFlow: A Mini Hiring Platform (Front-End Only)

This project is a technical assignment to build a single-page, front-end-only application simulating a mini hiring platform. It is built with **React** and **Vite**, utilizing modern front-end practices, advanced state management, and a robust mock API layer for a server-like experience.

### Application Overview

This is the main HR Dashboard, providing a quick overview of active jobs, new candidates, and key hiring insights.

![TalentFlow HR Dashboard with Key Insights](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image.png)

##  Core Features Implemented

The application implements three core modules: Jobs, Candidates, and Assessments, fulfilling all requirements of the technical assignment.

| Module | Core Functionality | Technical Implementation Details |
| :--- | :--- | :--- |
| **Jobs Board** | Create, Edit, Archive, and Reorder job postings. | Server-like pagination, filtering (title, status, tags), and sorting. **Optimistic updates** with rollback on drag-and-drop reordering using `@dnd-kit`. Deep linking to individual job pages (`/jobs/:jobId`). |

#### Jobs Board View

The Jobs Board administration page supports filtering by status (Active/Archived) and dynamic search by title or tags. Reordering is enabled via drag-and-drop.

![Jobs Board Administration: Listing, Filtering, and Reordering](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-1.png)

#### Individual Job Deep Link

The public-facing job view, accessible via deep link, shows the job description and an "Apply Now" button.

![Individual Job Deep Link View](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-2.png)
| **Candidates** | View, search, and manage candidate progression. | **Virtualized list** for 1000+ seeded candidates for performance. Client-side search (name/email) and server-like filtering (current stage). **Kanban board** (drag-and-drop) for stage transitions. Candidate profile with a status change timeline and note attachment. |

#### Candidate Kanban Board

The Kanban board allows HR to visually track and move candidates through the hiring pipeline using drag-and-drop.

![Candidate Kanban Board for Stage Management](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-3.png)

#### Candidate Profile

The Candidate Profile page shows the application details, a timeline of status changes, and a section for adding internal notes with support for `@mentions`.

![Candidate Profile with Timeline and Notes](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-4.png)
| **Assessments** | Build and administer job-specific quizzes/forms. | Comprehensive **Assessment Builder** with multiple question types (text, choice, numeric, file stub). Live preview of the form. **Form Runtime** with advanced validation and **conditional question logic**. |

#### Assessment Management

The Assessments page allows HR to manage and create new assessments per job.

![Assessment Management List](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-5.png)

#### Assessment Builder

The Assessment Builder features a live preview pane and supports various question types, validation rules, and conditional logic.

![Assessment Builder with Live Preview and Conditional Logic](https://github.com/VinayPrajwal226/TalentFlow/blob/f5a3d69e0861eacfda0b0be665af6866e50c90d2/public/images/image-6.png)

##  Technical Stack and Architecture

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React (v19), Vite | Modern front-end development and fast build tooling. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid and responsive UI development. |
| **Routing** | React Router v6 | Declarative routing for navigation. |
| **Mock API** | **MSW (Mock Service Worker)** | Intercepts network requests to simulate a full REST API, including artificial latency and error rates. |
| **Persistence** | **Dexie (IndexedDB)** | The single source of truth for all application data, ensuring state persistence across page refreshes. MSW handlers implement a "write-through" pattern to Dexie. |
| **Drag & Drop** | `@dnd-kit` | Used for Job reordering (optimistic updates) and Candidate stage movement (Kanban board). |
| **Forms** | `react-hook-form` | Efficient form management and validation. |
| **Data** | `@faker-js/faker` | Used to generate the required 1000+ candidates and seed data. |

##  Setup and Installation

### Prerequisites

*   Node.js (v18+)
*   npm (or npm/yarn)

### Installation Steps

1.  **Clone the repository:**
    \`\`\`bash
    git clone (https://github.com/VinayPrajwal226/TalentFlow.git)
    cd talent-flow
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or npm install
    \`\`\`

3.  **Run the application:**
    \`\`\`bash
    npm run dev
    # or npm run dev
    \`\`\`

The application will be available at `http://localhost:5173` (or the port specified by Vite). The initial seed data (25 jobs, 1000+ candidates, 3+ assessments) will be loaded into IndexedDB on the first run.
## Login
Login Password:admin 

##  Key Technical Decisions

### 1. Data Persistence and Mocking

*   **Decision:** Use **MSW** for the network layer and **Dexie** (IndexedDB) for local persistence.
*   **Justification:** This approach perfectly simulates a real-world application architecture where the client communicates with a server (MSW), but the data is locally persisted (Dexie). The MSW handlers act as the "server-side" logic, implementing the required write-through to IndexedDB, artificial latency (200-1200ms), and a 5-10% error rate on write operations to test resilience and optimistic update rollbacks.

### 2. Optimistic Updates and Error Handling

*   **Decision:** Implement drag-and-drop reordering for Jobs with **optimistic UI updates**.
*   **Justification:** For a better user experience, the UI updates immediately when the user drops a job. If the mock API (MSW) returns a simulated `500` error (5-10% chance), the application executes a **rollback**, reverting the job's position in the UI, demonstrating robust error handling for critical write operations.

### 3. Performance for Large Datasets

*   **Decision:** Employ a **virtualized list** for the Candidates board.
*   **Justification:** The requirement specifies handling 1000+ seeded candidates. Standard rendering would lead to significant performance degradation. Virtualization ensures that only the visible rows are rendered, maintaining a smooth 60fps scrolling experience even with a massive dataset.

### 4. Assessment Builder Logic

*   **Decision:** Use a single, complex state object for the form builder and a recursive rendering component for the form runtime.
*   **Justification:** This allows for dynamic form generation and easy implementation of **conditional question logic** (e.g., show Q3 only if Q1 is 'Yes'). The builder state is directly persisted to IndexedDB, allowing users to leave and return to an in-progress assessment design.

##  Known Issues and Future Improvements

### Known Issues

*   **Drag-and-Drop on Mobile:** While functional, the drag handles for reordering jobs and moving Kanban cards could be optimized for a better touch-screen experience.
*   **File Upload Stub:** The file upload question type is currently a UI stub and does not process or store actual file data (as per assignment scope). A future enhancement would be to integrate with a local storage solution like `localForage` for file data.

### Future Improvements

1.  **User Authentication:** Implement a full sign-in/sign-out flow with token management (currently a basic `AuthContext` stub).
2.  **Advanced Filtering:** Add multi-select tag filtering and date range filtering to the Jobs board.
3.  **Real-time Updates:** Integrate a WebSocket layer to simulate real-time updates for candidate stage changes across multiple HR users.

## 🔗 Deliverables

*   **Deployed App Link:** [https://talent-flow-delta.vercel.app/]
*   **GitHub Repository Link:** [(https://github.com/VinayPrajwal226/TalentFlow)]
