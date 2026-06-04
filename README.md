
# 🐞 Bug Tracking System

[![.NET](https://img.shields.io/badge/.NET-8.0-blue?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A full‑stack **Bug Tracking System** built with a backend API and a frontend UI to help teams track, manage, and resolve bugs efficiently throughout the software development lifecycle.

Users can **create, view, update, and delete** bug reports, assign them to developers, and track their status — making bug management faster and more organized.

---

## 🧠 Features

* 📌 Create and manage bug reports
* 🛠️ Update bug status (Open, In Progress, Fixed, Closed)
* 👤 Assign bugs to developers
* 📊 View and sort bug lists
* 🔐 Authentication & role-based access (JWT-based)
* 📡 REST API backend with Angular frontend

---

## 🗂️ Project Structure

```
Bug-Tracking-System/
├── BugTrackerAPI/        # Backend (.NET Web API)
│   ├── Controllers/      # Handles API endpoints (Auth, Bugs, Users)
│   ├── Data/             # Database context and migrations
│   ├── Models/           # User, Bug, Role entities
│   ├── DTOs/             # Request/response payloads
│   ├── Program.cs        # App startup, middleware, DI
│   └── appsettings.json  # Configurations (DB, JWT secret)
│
├── bug-tracker-ui/       # Frontend (Angular)
│   ├── components/       # UI components (Login, Signup, Dashboard, Bugs)
│   ├── services/         # API communication services (AuthService, BugService)
│   ├── interceptors/     # JWT token interceptor
│   ├── guards/           # Route guards for authentication
│   └── app.module.ts     # Main Angular module
│
└── Intern.sln            # Visual Studio solution file
```

---

## 🛠️ Tech Stack

**Backend**

* .NET 8 / C# Web API
* RESTful API
* Entity Framework Core + PostgreSQL
* JWT Authentication & Role-based Authorization

**Frontend**

* Angular 17 + TypeScript

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/priya2217/Bug-Tracking-System.git
cd Bug-Tracking-System
```

---

### Backend Setup – `BugTrackerAPI`

1. Navigate to the API folder

```bash
cd BugTrackerAPI
```

2. Install dependencies

```bash
dotnet restore
```

3. Configure environment in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=BugTracker;Username=postgres;Password=yourpassword"
}
```

4. Run migrations (if needed) and start server

```bash
dotnet build
dotnet run
```

5. Swagger UI (for API testing):

```
http://localhost:5245/swagger/index.html
```

---

### Frontend Setup – `bug-tracker-ui`

1. Navigate to the UI folder

```bash
cd bug-tracker-ui
```

2. Install packages

```bash
npm install
```

3. Start Angular dev server

```bash
npm start
```

4. Open in browser

```
http://localhost:4200
```

---

## 👩‍💻 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📦 License

MIT License © 2026

---

