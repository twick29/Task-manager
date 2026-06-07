# ✅ Task Manager App

A full-stack personal task management application built with
React, Node.js, and Express. Organize your daily tasks with
a clean, modern interface featuring drag-and-drop reordering,
real-time search, and persistent JSON storage.

---

## 🌟 Features

- ➕ **Create Tasks** — Add tasks with title, description, and due date
- 📋 **View Tasks** — See all tasks in a clean, organized list
- ✏️ **Edit Tasks** — Update task details anytime
- ✅ **Complete Tasks** — Toggle tasks between active and completed
- 🗑️ **Delete Tasks** — Remove tasks with confirmation dialog
- 🔍 **Search Tasks** — Real-time search by task title
- 🔽 **Filter Tasks** — Filter by All, Active, Completed, Overdue
- 📊 **Task Statistics** — Live stats dashboard with progress bar
- 🚨 **Overdue Detection** — Visual alerts for past-due tasks
- ⠿ **Drag and Drop** — Reorder tasks with smooth drag and drop
- 💾 **Data Persistence** — Tasks saved to JSON file survive restarts
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client for API calls |
| @hello-pangea/dnd | Drag and drop functionality |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| UUID | Unique ID generation |
| CORS | Cross-origin resource sharing |
| Nodemon | Auto-restart during development |

### Storage
| Technology | Purpose |
|-----------|---------|
| JSON File | Simple persistent data storage |

---

## 📁 Folder Structure
task-manager/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx        # Filter buttons
│   │   │   ├── SearchBar.jsx        # Search input
│   │   │   ├── StatsCard.jsx        # Statistics dashboard
│   │   │   ├── TaskForm.jsx         # Create/Edit form
│   │   │   ├── TaskItem.jsx         # Single task card
│   │   │   └── TaskList.jsx         # Task list with DnD
│   │   ├── services/
│   │   │   └── api.js               # Axios API functions
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── controllers/
│   │   └── taskController.js        # Business logic
│   ├── routes/
│   │   └── taskRoutes.js            # API routes
│   ├── data/
│   │   └── tasks.json               # JSON database
│   ├── server.js                    # Express server
│   └── package.json
│
└── README.md

---

## ⚙️ Installation

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

### Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### Install Backend Dependencies
```bash
cd server
npm install
```

### Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## 🚀 Running Locally

You need **two terminals** running simultaneously.

### Terminal 1 — Start Backend
```bash
cd task-manager/server
npm run dev
```
Server runs at: `http://localhost:5000`

### Terminal 2 — Start Frontend
```bash
cd task-manager/client
npm run dev
```
App runs at: `http://localhost:5173`

Open your browser and visit:
http://localhost:5173

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Get All Tasks
GET /tasks
Response 200:
{
"success": true,
"count": 2,
"data": [
{
"id": "uuid",
"title": "Buy groceries",
"description": "Milk and eggs",
"dueDate": "2024-12-31",
"completed": false,
"createdAt": "2024-01-01T10:00:00.000Z",
"updatedAt": "2024-01-01T10:00:00.000Z",
"order": 0
}
]
}

### Create a Task
POST /tasks
Content-Type: application/json
Body:
{
"title": "Buy groceries",       ← required
"description": "Milk and eggs", ← optional
"dueDate": "2024-12-31"         ← optional
}
Response 201:
{
"success": true,
"message": "Task created successfully",
"data": { ...task object }
}

### Update a Task
PUT /tasks/:id
Content-Type: application/json
Body:
{
"title": "Updated title",
"description": "Updated description",
"dueDate": "2024-12-31"
}
Response 200:
{
"success": true,
"message": "Task updated successfully",
"data": { ...updated task }
}

### Toggle Task Complete
PATCH /tasks/:id/toggle
Response 200:
{
"success": true,
"message": "Task marked as completed",
"data": { ...task with flipped completed }
}

### Delete a Task
DELETE /tasks/:id
Response 200:
{
"success": true,
"message": "Task deleted successfully",
"data": { ...deleted task }
}

### Reorder Tasks
PATCH /tasks/reorder
Content-Type: application/json
Body:
{
"tasks": [ ...array of tasks in new order ]
}
Response 200:
{
"success": true,
"message": "Tasks reordered successfully",
"data": [ ...reordered tasks ]
}

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure:
Name:            task-manager-api
Root Directory:  server
Runtime:         Node
Build Command:   npm install
Start Command:   npm start
6. Click **Create Web Service**
7. Copy your Render URL (e.g. `https://task-manager-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
Root Directory:  client
Framework:       Vite
Build Command:   npm run build
Output Dir:      dist
5. Add Environment Variable:
VITE_API_URL = https://your-render-url.onrender.com/api
6. Click **Deploy**

### Update API URL for Production

In `client/src/services/api.js`, update:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});
```

---

## 🔮 Future Improvements

- 🔐 User authentication and login
- 👥 Multi-user support
- 🏷️ Task categories and tags
- 📎 File attachments
- 🔔 Due date notifications
- 📊 Analytics dashboard
- 🌙 Dark mode
- 📤 Export tasks to CSV/PDF
- 🔄 Real-time sync with WebSockets
- 📱 Mobile app with React Native

---

## 👨‍💻 Author

Built as a technical assessment project demonstrating:
- Full-stack JavaScript development
- RESTful API design
- React component architecture
- Modern UI/UX with Tailwind CSS
- Data persistence with JSON storage

---

## 📄 License

MIT License — feel free to use this project for learning!