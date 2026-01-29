# TaskPilot 🚀

A full-stack task management application designed to help teams collaborate efficiently. Built with **Angular** and **Node.js**.

## 🌐 Live Demo
- **Client (Frontend):** [https://taskpilot-zbf1.onrender.com](https://taskpilot-zbf1.onrender.com)
- **Server (Backend):** [https://tasks-teacher-server.onrender.com](https://tasks-teacher-server.onrender.com)

## ✨ Features
- **User Authentication:** Secure login and registration using JWT.
- **Persistent Session:** Uses `/api/auth/me` to verify user status on page refresh.
- **Task Management:** Create, update, and delete tasks.
- **Team Collaboration:** Manage teams and assign tasks to users.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **Modern UI:** Built with Angular Material and Signals for state management.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Angular (v17+) using Signals API.
- **UI Components:** Angular Material.
- **Environment Management:** Automated file replacements for Local vs. Production URLs.
- **Deployment:** Render Static Site.

### Backend (Server)
- **Runtime:** Node.js & Express.js.
- **Database:** SQLite (managed via `better-sqlite3`).
- **Authentication:** JSON Web Tokens (JWT) with secure Middleware.
- **Deployment:** Render Web Service.

## 📂 Project Structure
```bash
TaskPilot/
├── client/                 # Angular Frontend
│   ├── src/
│   │   ├── app/            # Components, Services, Guards, Interceptors
│   │   ├── environments/   # Dev & Prod configuration files
│   │   └── assets/         # Global styles and assets
├── server/                 # Node.js Backend
│   ├── controllers/        # Auth & Task logic
│   ├── routes/             # Express Route definitions
│   ├── middleware/         # JWT Authentication logic
│   └── database.sqlite     # SQLite Database
└── README.md
⚙️ Installation & Local Setup
1. Clone the Repository
Bash
git clone [https://github.com/Tamar-Klein/AngularFinalProject.git](https://github.com/Tamar-Klein/AngularFinalProject.git)
cd AngularFinalProject
2. Backend Setup
Bash
cd server
npm install
npm start
Runs on http://localhost:3000

3. Frontend Setup
Bash
cd client
npm install
npm start
Runs on http://localhost:4200

🔌 API Endpoints
| Method | Endpoint | Description | | | | | | POST | /api/auth/register | Register a new user & get token | | POST | /api/auth/login | Authenticate user & get token | | GET | /api/auth/me | (New) Verify token and get current user info | | GET | /api/tasks | Retrieve all tasks | | POST | /api/tasks | Create a new task | | DELETE | /api/tasks/:id | Remove a task |

🚀 Deployment
This project is deployed on Render.

Frontend: Configured as a Static Site with a rewrite rule (/* -> /index.html) to support Angular routing.

Backend: Configured as a Web Service.

Communication: A Reverse Proxy rule is set up on the frontend to forward /api requests to the backend, avoiding CORS issues.

🔜 Future Improvements
[ ] Add drag-and-drop support for tasks (Kanban style).

[ ] Implement email notifications.

[ ] Add dark mode toggle.

[ ] Unit testing with Jasmine/Karma.

👤 Author
Tamar Klein

GitHub: @Tamar-Klein