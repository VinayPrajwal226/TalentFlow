# 🚀 TalentFlow – Mini Hiring Platform

TalentFlow is a React-based mini hiring platform designed for HR teams to manage Jobs, Candidates, and Assessments efficiently. This project simulates a real-world hiring workflow using Mock APIs and IndexedDB persistence for a complete offline experience — all without a backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)

[Live Demo](https://your-deployment-url.vercel.app) | [Report Bug](https://github.com/yourusername/talentflow/issues) | [Request Feature](https://github.com/yourusername/talentflow/issues)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Simulation](#-api-simulation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🧩 Jobs Management
- **List & Filter**: Server-like pagination, filtering, and sorting capabilities
- **CRUD Operations**: Create, edit, archive/unarchive jobs with validation
- **Smart Validation**: Required fields, unique slug generation
- **Drag & Drop Reordering**: Optimistic UI updates with automatic rollback on failure
- **Deep Linking**: Direct navigation to job details via `/jobs/:jobId`

### 👥 Candidates
- **Virtualized Lists**: Efficient rendering for 1000+ candidates
- **Advanced Search**: Real-time search by name/email with stage filtering
- **Kanban Board**: Visual stage management with drag-and-drop functionality
- **Detailed Profiles**: Comprehensive candidate view at `/candidates/:id`
- **Timeline Tracking**: Complete history of status changes
- **Notes System**: Add notes with @mentions support

### 🧾 Assessments
- **Dynamic Form Builder**: Create custom assessments per job
- **Question Types Supported**:
  - Single choice
  - Multiple choice
  - Short text
  - Long text
  - Numeric (with range validation)
  - File upload (stub)
- **Live Preview**: Real-time form preview pane
- **Advanced Features**:
  - Field validation (required, range, max length)
  - Conditional logic (show/hide questions based on responses)
  - IndexedDB persistence for responses and builder state

---

## 🏗️ Tech Stack

### Frontend
- **React** (18.x) with React Router for navigation
- **Tailwind CSS** / Shadcn UI for styling
- **Framer Motion** for animations
- **Zustand** / Context API for state management
- **React Query** for data fetching and caching

### Mock Server & Persistence
- **MirageJS** / **MSW** for API simulation
- **IndexedDB** (via Dexie.js) for local persistence
- **Mock Service Worker** for realistic network behavior

### Build & Deployment
- **Vite** as build tool
- Deployed on **Vercel** / **Netlify**

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/talentflow.git
cd talentflow

text

2. **Install dependencies**
npm install

or
yarn install

text

3. **Run the development server**
npm run dev

or
yarn dev

text

Visit [http://localhost:5173](http://localhost:5173) to view the application.

4. **Build for production**
npm run build

or
yarn build

text

5. **Preview the production build**
npm run preview

or
yarn preview

text

---

## 📁 Project Structure

talent-flow/
├── public/
│ ├── images/
│ │ └── heroImage.jpeg
│ ├── logo.png
│ ├── mockServiceWorker.js
│ └── vite.svg
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── AddNoteModal.jsx
│ │ ├── ApplicationForm.jsx
│ │ ├── AssessmentForm.jsx
│ │ ├── CandidateListCard.jsx
│ │ ├── Footer.jsx
│ │ ├── JobForm.jsx
│ │ ├── JobFormModal.jsx
│ │ ├── KanbanCard.jsx
│ │ ├── KanbanColumn.jsx
│ │ ├── Layout.jsx
│ │ └── Navbar.jsx
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── pages/
│ │ ├── About.jsx
│ │ ├── AllInsights.jsx
│ │ ├── AssessmentBuilder.jsx
│ │ ├── AssessmentFormPage.jsx
│ │ ├── Assessments.jsx
│ │ ├── CandidateKanban.jsx
│ │ ├── CandidateProfile.jsx
│ │ ├── Candidates.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Home.jsx
│ │ ├── Job.jsx
│ │ ├── JobCreate.jsx
│ │ ├── JobEdit.jsx
│ │ ├── Jobs.jsx
│ │ ├── JobsAdmin.jsx
│ │ └── LoginPage.jsx
│ ├── routers/
│ │ ├── ProtectedRoute.jsx
│ │ └── router.jsx
│ ├── services/
│ │ ├── db/
│ │ │ ├── assessmentsDb.js
│ │ │ ├── candidatesDb.js
│ │ │ ├── dexieInstance.js
│ │ │ ├── InsightsDb.js
│ │ │ └── jobsDb.js
│ │ └── mocks/
│ │ ├── assessmentHandlers.js
│ │ ├── browser.js
│ │ ├── candidatesHandlers.js
│ │ ├── insightsHandler.js
│ │ └── jobsHandlers.js
│ ├── seed/
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js

text

---

## 🧮 API Simulation

All API interactions are simulated through **MirageJS/MSW**, providing realistic behavior including:

### Simulated Characteristics
- **Latency**: 200–1200ms artificial delay
- **Error Rate**: 5–10% on write endpoints
- **Full CRUD Support**: Create, Read, Update, Delete operations


### Local Persistence

All data is synchronized with **IndexedDB**, enabling:
- ✅ Data restoration after page refresh
- ✅ Offline-ready functionality
- ✅ No backend dependency

---

## 📸 Screenshots
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/talentflow](https://github.com/yourusername/talentflow)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MirageJS](https://miragejs.com/)
- [Dexie.js](https://dexie.org/)
- [Shadcn UI](https://ui.shadcn.com/)

---

