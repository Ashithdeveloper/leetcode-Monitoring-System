# 🚀 LeetCode Monitoring System

An automated, modern full-stack web application designed for universities, coding clubs, bootcamps, and educational institutions to track, monitor, and analyze students' LeetCode problem-solving progress and growth in real time.

---

## 🌟 Key Features

- **⚡ Live LeetCode Sync**: Fetches real-time statistics (Total Solved, Easy, Medium, Hard breakdown) directly from LeetCode's public GraphQL API.
- **📈 7-Day Historical Analytics**: Retains and displays rolling 7-day progress history to monitor student consistency, streak momentum, and problem-solving velocity.
- **👥 Student & Batch Management**: Easily register students with metadata including Full Name, Roll Number, Department, Academic Year, and LeetCode Profile URL.
- **🎯 Dynamic Filtering & Leaderboard**: Instant search and filtering by Department and Academic Year, with responsive sortable cards and metrics.
- **🛡️ Advanced Role-Based Access Control (RBAC)**:
  - **Super Admin**: Full administrative control, team member creation, admin credential management, student recovery from Trash, and permanent record purge.
  - **Admin**: Authorized access to add students, soft-delete students (moving to Trash with history preserved), and provision new Standard Admins (cannot create Super Admins).
  - **Guest (Read-Only)**: Instant one-click demo login enabling safe inspection of dashboards and student profiles without mutation privileges.
- **♻️ Soft Delete & History Preservation**: Deleting a student preserves all past progress and metrics in a secure Trash Vault. Super Admins can recover students back to the active leaderboard anytime or permanently delete them.
- **⏰ Automated Background Cron Job**: Daily midnight scheduler that iterates through all active students and refreshes stats with built-in rate-limit delays.
- **💓 Keep-Alive Ping Service**: Integrated self-ping worker designed to prevent free-tier cloud instances (such as Render) from entering idle sleep mode.
- **🎨 Modern Glassmorphic UI**: Crafted with React 19, Tailwind CSS v4, Lucide icons, and responsive layouts for desktop and mobile viewports.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Scheduling**: Node-Cron
- **External Data**: LeetCode GraphQL API via Axios

---

## 📂 Project Architecture

```plaintext
leetcode-monitoring-system/
├── backend/
│   ├── controllers/       # Business logic (student stats, soft delete, restore)
│   ├── jobs/              # Schedulers (Daily midnight cron, keep-alive ping)
│   ├── middleware/        # JWT auth & role validation middleware
│   ├── models/            # Mongoose schemas (Admin, Student)
│   ├── routes/            # Express API route declarations
│   ├── utils/             # LeetCode GraphQL query & parsing utilities
│   ├── .env.example       # Sample backend environment configuration
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Express app entry point & database initialization
│
├── frontend/
│   ├── public/            # Static assets & icons
│   ├── src/
│   │   ├── assets/        # Visual assets & images
│   │   ├── components/    # Reusable UI & Page components
│   │   │   ├── AddStudentModal.jsx
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── StudentDetail.jsx
│   │   ├── api.js         # Centralized Axios client & API helpers
│   │   ├── App.jsx        # Routing, navigation bar & protected routes
│   │   ├── main.jsx       # React application entry point
│   │   └── index.css      # Tailwind design system imports
│   ├── package.json       # Frontend dependencies and scripts
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js     # Vite configuration
│
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Ashithdeveloper/leetcode-Monitoring-System.git
cd "leetcode Monitoring System"
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/leetcode-monitor
   JWT_SECRET=your_super_secret_jwt_key
   
   # Initial Super Admin (Seeded automatically on first database run)
   SUPERADMIN_USERNAME=admin
   SUPERADMIN_PASSWORD=your_secure_password
   
   # Optional: Keep-alive URL for free hostings (e.g., Render)
   API_URL=https://your-backend-service.onrender.com
   ```

5. Start the backend server:
   - **Development mode** (with file watch):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Role-Based Access Control (RBAC)

| Feature / Action | Guest (Demo) | Standard Admin | Super Admin |
| :--- | :---: | :---: | :---: |
| View Dashboard & Metrics | ✅ | ✅ | ✅ |
| View Student Detailed Profile & History | ✅ | ✅ | ✅ |
| Add New Student | ❌ | ✅ | ✅ |
| Soft Delete Student (Move to Trash) | ❌ | ✅ | ✅ |
| View Trash / Archive Vault | ❌ | ❌ | ✅ |
| Recover / Restore Deleted Student | ❌ | ❌ | ✅ |
| Permanently Delete Student | ❌ | ❌ | ✅ |
| Create Standard Admin Users | ❌ | ✅ | ✅ |
| Create Super Admin Users | ❌ | ❌ | ✅ |
| View Admin List | ❌ | ✅ | ✅ |
| Change Super Admin Password | ❌ | ❌ | ✅ |

---

## 📡 API Endpoints Reference

### 🔑 Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/guest` | Public | Generate guest session token |
| `POST` | `/api/auth/login` | Public | Authenticate admin / superadmin credentials |
| `POST` | `/api/auth/update-password` | Private (SuperAdmin) | Update superadmin account password |
| `POST` | `/api/auth/register-admin` | Private (Admin / SuperAdmin) | Register a new admin (Admins can only create Standard Admins) |
| `GET` | `/api/auth/admins` | Private (Admin / SuperAdmin) | List all registered admin accounts |

### 👨‍🎓 Student Management Routes (`/api/students`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Public / Protected | Get all active students with latest stats |
| `GET` | `/api/students/deleted` | Private (SuperAdmin) | Get all soft-deleted students with deletion metadata |
| `GET` | `/api/students/:id` | Public / Protected | Get single student details & full 7-day progress history |
| `POST` | `/api/students/add` | Private (Admin / SuperAdmin) | Register new student & fetch initial LeetCode stats |
| `DELETE`| `/api/students/:id` | Private (Admin / SuperAdmin) | Soft delete a student (moves to Trash, preserves history) |
| `PUT` | `/api/students/:id/restore` | Private (SuperAdmin) | Restore a soft-deleted student back to active leaderboard |
| `DELETE`| `/api/students/:id/permanent` | Private (SuperAdmin) | Permanently erase a student record and all history |

---

## ⏱️ Background Schedulers

### 1. Daily LeetCode Sync (`jobs/cron.js`)
- Runs every day at **00:00 (Midnight)**.
- Queries MongoDB for active registered students.
- Fetches the latest problem metrics from LeetCode.
- Appends to the student's 7-day history array (rolling window).
- Implements a **2-second delay** between requests to prevent hitting LeetCode rate limits.

### 2. Keep-Alive Ping (`jobs/ping.js`)
- Runs every **14 minutes**.
- Sends a `GET` request to `API_URL` to prevent free hosting platforms (e.g., Render) from spinning down due to inactivity.

---

## 📦 Build & Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
```
- Output folder: `frontend/dist`
- Set the environment variable in your deployment platform: `VITE_API_URL=https://your-backend-api.com/api`

### Backend (Render / Railway / VPS)
```bash
cd backend
npm install --production
npm start
```
- Configure all environment variables from `.env.example` in your hosting dashboard.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
