# 🚀 Real-Time Collaborative Task Workspace (Monorepo)

A production-grade, multi-user real-time task management platform engineered for distributed team collaboration. Moving away from standard, isolated private lists, this architecture implements a multi-tenant assigned task distribution matrix. It utilizes high-frequency real-time event streaming via WebSockets (Socket.io) to propagate state updates across all connected clients instantaneously without polling overhead.

---

## Live Demo:- https://techy-ui.github.io/task/

## 🎯 Project Core Objectives & Scope Deliverables

This system was designed and delivered to meet rigorous full-stack development specifications, resolving modern coordination bottlenecks through a predefined engineering scope:

1. Full-Stack Systems Engineering: Implemented a decoupled architecture using React 18+ for front-end interface mechanics and Node.js/Express for backend transaction processing.
2. Cryptographic Security Framework: Engineered an explicit User Authentication and Authorization layer utilizing JSON Web Tokens (JWT) to secure user spaces and state routes.
3. Advanced Document Orchestration: Developed robust backend CRUD APIs to seamlessly handle user accounts, project instantiation, multi-user assignment handling, and lane-based phase tracking.
4. Low-Latency Collaborative Architecture: Integrated bidirectional WebSocket channels providing zero-latency notifications and instant viewport updates to active teammates whenever boards mutate.

---
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



