import axios from "axios";

// ─── Create Axios Instance ────────────────────────────────────────────────
// This sets up a reusable axios client with default settings
const api = axios.create({
  baseURL: "/api", // All requests start with /api
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// ─── Request Interceptor ──────────────────────────────────────────────────
// Runs BEFORE every request is sent
// Perfect place to add auth tokens later
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers here in the future
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────
// Runs AFTER every response is received
// Handles global errors in one place
api.interceptors.response.use(
  (response) => {
    // Any status code in 2xx range triggers this
    return response;
  },
  (error) => {
    // Any status code outside 2xx triggers this
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

// ─── Task API Functions ───────────────────────────────────────────────────

// 1. GET ALL TASKS
// Fetches all tasks from the server
export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

// 2. CREATE A TASK
// Sends new task data to the server
// taskData = { title, description, dueDate }
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

// 3. UPDATE A TASK
// Updates an existing task by ID
// taskData = { title, description, dueDate }
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

// 4. TOGGLE TASK COMPLETE / INCOMPLETE
// Flips the completed status of a task
export const toggleTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data;
};

// 5. DELETE A TASK
// Permanently removes a task by ID
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// 6. REORDER TASKS (Drag and Drop)
// Saves the new order of tasks after drag and drop
// tasks = array of task objects in new order
export const reorderTasks = async (tasks) => {
  const response = await api.patch("/tasks/reorder", { tasks });
  return response.data;
};

export default api;