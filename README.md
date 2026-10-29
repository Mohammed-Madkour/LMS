<div align="center">

  # 🎓 Edemy - Madkour — MERN Stack Learning Management System

  **A modern full-stack Learning Management System (LMS) built with the MERN stack for dynamic course management, student learning, interactive reviews, and full administration.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://lms-orcin-one.vercel.app/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

  ---

  🚀 **Explore the Live Application:**  
  ### 🔗 [https://lms-orcin-one.vercel.app/]

</div>

---

## 📖 Project Overview

**Edemy - Madkour** is an end-to-end Learning Management Platform designed to connect instructors and students through an intuitive interface.

Instructors have complete **CRUD (Create, Read, Update, Delete)** control over courses and curriculum content, while students can explore course catalogs, track their learning progress, and share feedback through a integrated star-rating and review system.

---

## 🔥 Key Features

### 👨‍🏫 Instructor & Admin Management (Full CRUD)
* **Create:** Publish new courses complete with titles, descriptions, categories, pricing, and curriculum modules.
* **Read:** View active student enrollments, course feedback, and course statistics.
* **Update:** Edit existing course curriculum, modify pricing, update thumbnails, and revise materials in real time.
* **Delete:** Remove or archive outdated courses and lesson contents cleanly.

### 🎓 Student Experience & Feedback
* **Dynamic Catalog Search:** Discover courses using real-time search, category filters, and sorting.
* **Interactive Reviews & Ratings ⭐:** Leave detailed course feedback and star ratings to guide other learners and provide feedback to instructors.
* **Personal Dashboard:** Access enrolled courses, track current progress, and manage personal profile settings.

### 🛡️ Authentication & Authorization
* **Role-Based Access Control (RBAC):** Distinct dashboards and protected routes for **Students**, **Instructors**, and **Admins**.
* **Secure Authentication:** User registration/login powered by JWT (JSON Web Tokens) and password hashing with `bcryptjs`.
---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client)**
* **Framework / Library:** React.js (Single Page Application architecture)
* **Styling:** Tailwind CSS for fully responsive, accessible component layouts
* **HTTP Client:** Axios for efficient REST API calls

  
 ### **Backend (Server)**
* **Runtime:** Node.js
* **Framework:** Express.js (RESTful API architecture)
* **Database:** MongoDB Atlas (Managed via Mongoose ODM)
* **Authentication:** JWT & bcrypt.js
* **Deployment:** Vercel

