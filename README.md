# ⚡ NovaTask

A modern, fast, and responsive full-stack task management application built with **React**, **Tailwind CSS v4**, **Node.js/Express**, and **MySQL**.

---

## ✨ Features

- 🔐 **User Authentication**: Secure user registration and login powered by **JWT (JSON Web Tokens)** and password hashing with **bcrypt**.
- 📋 **Task Management (CRUD)**: Create, view, update, and delete tasks with real-time status updates (Active / Completed).
- 🔍 **Search & Filter**: Instant search by task title or description, with filter tabs (*All*, *Active*, *Completed*).
- 📊 **Stats Dashboard**: Live task metrics tracking total, in-progress, and completed tasks.
- 🌓 **Dark & Light Mode**: Built-in dynamic theme switcher with persistence in local storage and system theme detection.
- 📱 **Fully Responsive**: Mobile-friendly navigation with an animated dropdown menu and modern glassmorphism design.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) (`mysql2` connection pool)
- **Security**: `jsonwebtoken` (JWT), `bcrypt`, `cors`, `validator`

---

## 📁 Project Structure

```text
NovaTask/
├── backend/
│   ├── config/          # MySQL database connection pool
│   ├── controllers/     # Task and User route controllers
│   ├── database/        # Database schema initialization scripts
│   ├── middleware/      # JWT authentication middleware
│   ├── routes/          # Express route definitions (/api/user, /api/task)
│   ├── server.js        # Server entry point
│   ├── .env.example     # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # Axios instance with auth interceptor
│   │   ├── components/  # Navbar, TaskCard, TaskModal, ProtectedRoute
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # Dashboard, Login, Register
│   │   ├── App.jsx      # Router configuration
│   │   ├── index.css    # Tailwind CSS imports & global theme styles
│   │   └── main.jsx     # App entry point
│   ├── vite.config.js   # Vite configuration with @tailwindcss/vite
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally or in the cloud

---

### **1. Clone the Repository**
```bash
git clone https://github.com/nithintechie123/NovaTask.git
cd NovaTask
```

---

### **2. Backend Setup**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=novatask
   DB_PORT=3306

   PORT=8000
   JWT_SECRET=your_jwt_secret_key
   ```

5. Initialize the MySQL database tables:
   ```bash
   npm run db:init
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:8000`.*

---

### **3. Frontend Setup**

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend will be running at `http://localhost:5173`.*

---

## 📡 API Endpoints

### **Authentication (`/api/user`)**
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/user/register` | Register a new user | No |
| `POST` | `/api/user/login` | Log in and receive JWT token | No |
| `GET` | `/api/user/me` | Fetch active authenticated user profile | Yes (Bearer Token) |

### **Tasks (`/api/task`)**
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/task` | Get all tasks for current user | Yes (Bearer Token) |
| `POST` | `/api/task` | Create a new task | Yes (Bearer Token) |
| `PUT` | `/api/task/:id` | Update title, description, or status | Yes (Bearer Token) |
| `DELETE` | `/api/task/:id` | Delete a task | Yes (Bearer Token) |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
