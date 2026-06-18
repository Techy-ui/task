# 🚀 Real-Time Collaborative Task Workspace (Monorepo)

A production-grade, multi-user real-time task management platform engineered for distributed team collaboration. Moving away from standard, isolated private lists, this architecture implements a multi-tenant assigned task distribution matrix. It utilizes high-frequency real-time event streaming via WebSockets (Socket.io) to propagate state updates across all connected clients instantaneously without polling overhead.

---

## Live Demo:- https://techy-ui.github.io/task/

## 🏛️ System Architecture Overview

The application is deployed as a decoupled monorepo architecture that isolates layout-rendering from transactional data layers:

            Frontend Client (React/Vite)             
         Deployed on GitHub Pages Architecture        
                        │                │
             HTTP Requests (REST)  WebSocket Events (WS)
            JSON Web Tokens (JWT)  Bidirectional / Low-Latency
                        │                │
            Backend Node/Express Server              
             Hosted Environment on Render            
                        │
                 Mongoose Queries
                        │
             MongoDB Atlas Cloud Cluster             
              NoSQL Document Storage                 

---

## 🛠️ Enterprise Tech Stack

* Frontend Engine: React 18+ (Functional Components, Hooks Architecture)
* Build Pipeline: Vite (Highly optimized module bundling and lightning-fast HMR)
* Backend Runtime: Node.js with an Express application wrapper
* Real-Time Layer: Socket.io (Engineered over native WebSockets with fallback long-polling safety hooks)
* Database Management: MongoDB Cloud Cluster interacting through Mongoose ODM
* State & Network Security: JSON Web Tokens (JWT) for cryptographic stateless session verification

---

## 💡 Key Architectural Features

* Multi-User RBAC & Authentication: Stateful signups and secure sign-ins backed by bcryptjs password hashing and signed JWT validation.
* Granular Context-Aware Feeds: Users only see tasks relevant to their operational context—specifically, tasks they personally authored or tasks where their username is explicitly listed as an assignee.
* Bulk Assignee Parsing: The backend splits assignee strings (e.g., akash, rahul, preeti) automatically into array schemas, mapping tasks to multiple user dashboards concurrently.
* Zero-Latency State Sync: When a task is added, moved between lifecycle lanes, or removed, a WebSocket broadcast updates the UI of all affected online users instantaneously.
* Asynchronous Lifecycle Controls: Quick state machines that cycle a task through its linear phases: Pending -> In Progress -> Completed.

---

## 📁 Monorepo Directory Architecture

task-manager-workspace/
├── backend/                        # API & WebSocket Event Kernel
│   ├── models/                     # Data Object Mapping Schemas
│   │   ├── User.js                 # Authentication Schema (Username, Hash)
│   │   └── Task.js                 # Task Schema (Title, Descr, Status, Assignees)
│   ├── routes/                     # Operational Routing Endpoints
│   │   ├── authRoutes.js           # Auth Processing Gateway (/api/auth)
│   │   └── taskRoutes.js           # Document CRUD Pipelines (/api/tasks)
│   ├── server.js                   # Master Initialization Engine & WS Handshake
│   └── package.json
└── frontend/                       # Client Single-Page Application (SPA)
    ├── src/
    │   ├── App.jsx                 # Central Application Kernel, State & Sockets
    │   ├── App.css                 # Custom Component UI Layout Engine
    │   └── main.jsx                # DOM Entrypoint Anchor
    ├── vite.config.js              # Build configurations & Base Asset paths
    └── package.json

---

## 📡 API Specification & System Communication Protocols

### 🔒 1. Authentication Endpoints (/api/auth)

* POST /register
  - Description: Provisions a new user account.
  - Payload Requirements: { "username": "...", "password": "..." }
  - Server Response: 201 Created + JWT Token

* POST /login
  - Description: Validates credentials and yields authorization.
  - Payload Requirements: { "username": "...", "password": "..." }
  - Server Response: 200 OK + JWT Token

### 📋 2. Task Management Endpoints (/api/tasks)
Note: All endpoints below expect a "Bearer <token>" string included inside the HTTP Authorization request header.

* GET /
  - Description: Retrieves all context-valid tasks for the user.
  - Payload Requirements: None
  - WS Broadcast Event Triggered: None

* POST /
  - Description: Creates a new task object in the cluster.
  - Payload Requirements: { "title": "...", "description": "...", "assignees": "..." }
  - WS Broadcast Event Triggered: task_changed

* PUT /:id
  - Description: Cycles task status lane value.
  - Payload Requirements: { "status": "In Progress" } (or Pending/Completed)
  - WS Broadcast Event Triggered: task_changed

* DELETE /:id
  - Description: Removes the object permanently from database.
  - Payload Requirements: None
  - WS Broadcast Event Triggered: task_changed

### 🔌 3. WebSocket Real-Time Event Mappings
The application connects via an upgraded TCP handshake directly to the Node server.

* Inbound Listeners (client.on):
  - task_changed: Emitted by the backend instantly when any database mutation occurs. Upon reception, all active clients seamlessly fire an asynchronous background fetchTasks() request to refresh their viewport without blocking the interface.

---

## 🏁 Installation, Configuration & Local Development

To run this system locally on an engineering workstation, follow these steps:

### Phase A: Database & Backend Server Setup
1. From the monorepo root folder, shift down into the server environment:
   cd backend
2. Install standard node modules:
   npm install
3. Generate a local configuration file named .env right inside the /backend directory:
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskDB
   JWT_SECRET=X7f9K2s_EnterpriseSecretKey_pP9q2W
4. Run the development initialization command:
   node server.js

### Phase B: UI Client Environment Setup
1. Launch a separate terminal interface from the project root and jump into the frontend:
   cd frontend
2. Install client dependencies:
   npm install
3. Boot up the Vite rendering instance:
   npm run dev
4. Point your browser engine to: http://localhost:5173

---

## 🌐 Production Cloud Deployment Summary

The operational stack has been successfully configured and compiled for automated cloud operations:

* Backend Network Architecture: Hosted via an automated continuous deployment pipeline on Render. Node runtime handles multi-tenant connections and dynamic CORS origin authorization checks.
* Frontend Web Distribution: Static compilation directories (dist/) are delivered serverlessly globally via GitHub Pages tracking isolated gh-pages branch subtrees.
