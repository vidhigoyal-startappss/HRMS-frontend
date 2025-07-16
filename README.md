# HRMS – Human Resource Management System

A scalable, modular and role-based Human Resource Management System built using **React.js**, **NestJS**, and **MongoDB**, designed to streamline the entire employee lifecycle from onboarding to exit management. The application features user roles with specific permissions, document automation, and smart dashboards with insights, reminders, and utilities like attendance and leave tracking.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [User Roles & Permissions](#user-roles--permissions)
- [Completed Modules](#completed-modules)
- [Upcoming Modules](#upcoming-modules)
- [Figma Design Reference](#figma-design-reference)
- [Color Palette](#color-palette)
- [Installation Guide](#installation-guide)
- [Deployment](#deployment)
- [License](#license)

---

## 🧾 About the Project

The **HRMS** is an internal product developed to centralize and automate HR functions such as:

- Employee profile and document management
- Attendance and leave tracking
- Role-based dashboards and insights
- Payroll setup and payslip generation
- Reminders for birthdays, anniversaries, and onboarding
- PDF generation of HR documents like offer letters and appraisals
- Change request workflows between employees and HR

It’s designed to be modular, scalable, and secure, using RESTful APIs and built-in access control.

---

## 🛠️ Tech Stack

| Tech             | Description                              |
|------------------|------------------------------------------|
| **React.js**      | Frontend framework                       |
| **NestJS**        | Backend framework using Node.js          |
| **MongoDB**       | Document-based NoSQL database            |
| **Mongoose**      | ODM for MongoDB                          |
| **Tailwind CSS**  | Utility-first CSS framework              |
| **Vite**          | Fast bundler for frontend                |
| **Render**        | Deployment platform for frontend/backend |
| **pdf-lib / Puppeteer** | For generating downloadable PDFs   |
| **JWT**           | Secure role-based authentication         |

---

## 🧩 Project Architecture

📁 backend/
┣ 📂src/
┃ ┣ 📂modules/ (users, auth, attendance, leave, payroll, reports, documents)
┣ .env
┣ main.ts

📁 frontend/
┣ 📂src/
┃ ┣ 📂pages/
┃ ┣ 📂components/
┃ ┣ 📂routes/
┃ ┣ 📂utils/
┣ .env

---

## 👤 User Roles & Permissions

| Role        | Access Control Summary                                                                 |
|-------------|-----------------------------------------------------------------------------------------|
| **SuperAdmin** | Full access to all modules, users, approvals, payroll and configurations           |
| **Admin**       | Can manage users, approvals, documents, leaves, and payroll                       |
| **HR**          | Handles onboarding, leave approvals, payroll, change requests, documents          |
| **Manager**     | Views team reports, handles approvals at team level                               |
| **Employee**    | Can check-in/out, apply leave, view payslips, request changes, and view documents |

Permission control is implemented using `RolesGuard` and `JwtAuthGuard` in backend.

---

## ✅ Completed Modules

### 1. 📊 Dashboard
- Personalized based on role
- Metrics: Total Employees, Leaves, Absentees, Payroll (clickable cards)
- Scrollable recent employees section
- Check-In / Check-Out feature with live timer
- Reminders: Birthdays, Anniversaries, Festivals
- Notification Bell, Code of Conduct download, sidebar menu

---

### 2. 🔐 Authentication
- SuperAdmin registration
- Login with email/password
- Forgot password → reset via email link
- Token-based authentication using JWT
- Guards: `JwtAuthGuard`, `RolesGuard`

---

### 3. 👥 Employee Management
- Employee table (Full Name, Email, DOJ, Designation, Employment Type, Gender)
- Universal search + filter by designation, gender, employment type
- Create User → Stepper form (Basic → Education → Bank)
- Soft Delete (only by SuperAdmin)
- Archived user view
- View/Edit Profile (role-based)
- Profile Image upload
- View all employees, pagination, conditional rendering

---

### 4. 🕘 Attendance Management
- Attendance Card: Check-In, Check-Out, Location, Role, Status
- Auto-timer on Check-In
- Tables:
  - My Attendance History: for employees
  - Today's Attendance + History of all employees: for Admin/HR/SuperAdmin
- Role-wise permissions handled in backend

---

### 5. 🗓️ Leave Management
- Employee leave application form: start date, end date, type, reason, proof
- Approvals: Admin/HR/SuperAdmin can approve/reject
- Leave History modal with statuses
- Optional comments from HR during approval
- Role-based leave visibility

---

## 🕐 Upcoming Modules

### 6. 💰 Payroll Management
- Salary structure (Basic Pay, HRA, Travel, PF, Tax, etc.)
- Monthly payslip generation (bulk and individual)
- View payslip history (employee-wise)
- View team salary summary (for Manager)
- Access-controlled by role

---

### 7. 📊 Reports Module
- Attendance, Leave, Payroll analytics
- Role-based visibility (all/team/self)
- Charts: Bar, Pie, Line
- Export options: CSV, PDF
- Audit history logs
- Filters by date, department, employee

---

### 8. 📄 Document Management
- Templates: Offer Letter, Intern Letter, Appraisal, Payslip, Experience Letter
- Placeholders: `{{employeeName}}`, `{{joiningDate}}`, etc.
- PDF generated via Puppeteer from HTML
- Display in **My Documents** section on profile/dashboard
- Auto-download on first login for offer/intern letter

---

### 9. 🔁 Change Request System
- Fields: Type of Change, Old Value, New Value, Reason, Optional Proof Upload
- Submitted by Employee → Received by HR
- HR actions: Approve, Reject, Comment
- Employee can see request status under history

---

### 10. 🔔 Notification System
- Onboarding, Birthdays, Anniversaries → Popup card on login
- Toast notifications for leave approvals, change request updates, etc.
- Global notification icon for alerts (bell icon)

---

## 🎨 Figma Design Reference

[Figma Design – High Fidelity](https://www.figma.com/design/SJmCKV7QtomqRIXUM8aO5a/HRMS-Human-Resource-management-system---Employee-mnagement-System----HIgh-fidelity--Community-?node-id=0-1&p=f&t=5DXQRu5bKlDAB2ms-0)

---

## 🎨 Color Palette

| Element        | Hex Code   |
|----------------|------------|
| Background     | `#F3F9FB`  |
| Accent Blue    | `#87C0CD`  |
| Primary Blue   | `#226597`  |
| Dark Blue      | `#113F67`  |

---

## ⚙️ Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/hrms-project.git
cd hrms-project
2. Setup Backend
bash
Copy
Edit
cd backend
npm install
cp .env.example .env
npm run start:dev
3. Setup Frontend
bash
Copy
Edit
cd frontend
npm install
cp .env.example .env
npm run dev
```
Ensure MongoDB is running locally or your cloud URI is set in the .env file.

## 🚀 Deployment
Platform Used: Render

Backend and frontend are deployed separately.

Environment variables securely configured in dashboard.

CI/CD via GitHub connected repo.

## 📄 License
This is an internal product developed for organizational use only. Redistribution or unauthorized commercial use is strictly prohibited.

Let me know if you'd like a `.md` file download link, or to add badges (build, license, tech stack), or to include instructions for `.env` files or how to set up MongoDB Atlas if deploying externally.
