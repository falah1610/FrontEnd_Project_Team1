# 🖥️ AI Tool Finder – Frontend Documentation

## 📌 Project Overview

The AI Tool Finder Frontend is a responsive web application that allows users to discover, filter, and review AI tools. It is built using HTML, CSS, and Vanilla JavaScript and communicates with a FastAPI backend using REST APIs secured with JWT authentication.

The frontend supports role-based UI rendering for Users and Admins, dynamic data loading, and real-time filtering of AI tools.

---

## 🧱 Technology Stack

Markup: HTML5  
Styling: CSS3  
Logic: Vanilla JavaScript  
API Communication: Fetch API  
Authentication: JWT (stored in localStorage)  
Backend: FastAPI  

---

## 📁 Folder & File Structure

frontend/
index.html          – Home page (tool discovery & filters)  
tools.html          – Tools listing page  
tool-detail.html    – Tool details & reviews  
auth.html           – Login & Registration  
profile.html        – User profile  
admin.html          – Admin dashboard  
loader.html         – Loading overlay  

styles.css          – Global styling  

script.js           – Home page logic  
api.js              – API abstraction layer  
auth.js             – Authentication logic  
profile.js          – Profile handling  
admin.js            – Admin operations  
tool-detail.js      – Tool details & reviews  

config.js           – Backend base URL configuration  
README.md  

---

## 🌐 Pages Overview

### 1️⃣ Home Page (index.html)

Purpose:
- Display all AI tools
- Enable search and filtering

Features:
- Search by tool name
- Filters by category, pricing type, and minimum rating
- Dynamic tool cards rendered from API data
- Authentication-aware navigation bar

Related Script:
- script.js

---

### 2️⃣ Authentication Page (auth.html)

Purpose:
- User login and registration

Features:
- JWT-based authentication
- Role detection (USER / ADMIN)
- Automatic redirect after successful login

Related Script:
- auth.js

---

### 3️⃣ Tool Detail Page (tool-detail.html)

Purpose:
- Display detailed information about a selected AI tool

Features:
- Tool metadata (name, category, pricing, use case)
- Average rating (approved reviews only)
- Approved reviews list
- Review submission form for authenticated users

Related Script:
- tool-detail.js

---

### 4️⃣ Profile Page (profile.html)

Purpose:
- Display logged-in user details

Features:
- User information
- Role display
- Logout functionality

Related Script:
- profile.js

---

### 5️⃣ Admin Dashboard (admin.html)

Purpose:
- Admin-only management interface

Features:
- Add new AI tools
- Update existing tools
- Delete tools
- Approve or reject user reviews
- Role-based access enforcement

Related Script:
- admin.js

---

## 🔌 API Integration (api.js)

Responsibilities:
- Centralized API communication
- Attaching JWT tokens to requests
- Handling loading states
- Handling API errors

Behavior:
- Reads BASE_URL from config.js
- Uses Fetch API
- Automatically includes Authorization header when token exists

---

## 🔐 Authentication & Authorization

- JWT tokens are stored in localStorage
- Navigation bar updates dynamically based on authentication state
- Admin links are hidden for non-admin users
- Protected actions require a valid JWT token

---

## 🎛️ Search & Filtering Logic

Supported Filters:
- Category (partial, case-insensitive)
- Pricing type (exact match)
- Minimum average rating

Behavior:
- Selected filters are converted into query parameters
- Frontend calls the /tools endpoint
- UI updates dynamically without page reload

---

## 🎨 Styling (styles.css)

Highlights:
- Responsive layout
- Grid-based tool cards
- Loader animation
- Clean admin dashboard UI
- Mobile-friendly design

---

## 🔄 Loader System (loader.html)

- Displayed during API requests
- Prevents UI flickering
- Controlled via JavaScript functions
- Automatically shown and hidden during fetch calls

---

## ⚠️ Error Handling

- API errors handled gracefully
- User-friendly alert messages
- Form validation feedback
- Unauthorized access redirects to login page

---

## 🔐 Security Best Practices

- No sensitive data hardcoded
- JWT required for protected operations
- Role-based UI rendering
- Admin actions validated both frontend and backend

---

## 🚀 Extensibility

The frontend architecture allows easy addition of:
- Pagination
- Sorting options
- Favorites / bookmarks
- Dark mode
- Review editing
- OAuth-based login

---

## 🧪 Browser Compatibility

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Modern mobile browsers

---

## 📌 Summary

The AI Tool Finder Frontend is a clean, modular, and scalable client-side application that complements the FastAPI backend. It demonstrates real-world frontend practices such as REST API integration, JWT-based authentication, role-based UI control, and dynamic content rendering using Vanilla JavaScript.
