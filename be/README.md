# Blockchain & Medication Project

## Overview

Blockchain & Medication is a web application designed to manage and store medical information, including inventory, medicine tracking, and related operations. The backend is built with Node.js, Express, and MongoDB, integrating Cloudinary for image storage and IPFS (Pinata) for decentralized file management.

---

## List of errors

https://docs.google.com/document/d/17OKpuB-E1tEiguHCbjHtnn3pHkuabH3ONwFfXuRobQ0/edit?usp=sharing

## Installation Guide

Follow the steps below to install, configure, and run the project.

### 1️. Prerequisites

Make sure you have installed the following tools:

* **Node.js** (version ≥ 18.0.0)
* **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
* **Yarn** or **npm**

### 2️. Clone the Repository

```bash
git clone https://gitlab.com/hanh556/medical.git
cd medical
```

### 3️. Install Dependencies

```bash
yarn install
# or
npm install
```

### 4️. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medical

# JWT
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
JWT_SECRET=<your_jwt_secret>
JWT_SECRET_REFRESH=<your_jwt_refresh_secret>

# Email (for sending notifications)
MY_EMAIL=<your_email@gmail.com>
EMAIL_PASSWORD=<your_app_password>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# IPFS (Pinata)
PINATA_JWT=<your_pinata_jwt_token>

# Roles
ROLE_ADMIN=superAdmin,manufacturer,distributor,pharmacy,hospital
ID_GUEST=<guest_role_id>
ID_ROLE_MANUFACTURER=<manufacturer_role_id>
ID_ROLE_HOSPITAL=<hospital_role_ids>
```

### 5️. Run the Application

Run in development mode (with automatic reload):

```bash
yarn dev
```

Or run in production mode:

```bash
yarn start
```

By default, the app runs at:
[http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
medical/
├── controllers/        # Business logic
├── middlewares/        # Express middlewares
├── models/             # Mongoose schemas
├── routes/             # API routes
├── services/           # External or helper services
├── utils/              # Helper functions
├── server.js           # Main entry point
├── package.json        # Project dependencies
└── .env                # Environment variables
```

---

## Dependencies

The main libraries and frameworks used in this project:

| Library          | Version | Description               |
| ---------------- | ------- | ------------------------- |
| express          | 5.1.0   | Web framework for Node.js |
| mongoose         | 8.16.0  | MongoDB ODM               |
| dotenv           | 16.5.0  | Environment configuration |
| bcrypt           | 6.0.0   | Password hashing          |
| jsonwebtoken     | 9.0.2   | JWT authentication        |
| multer           | 2.0.1   | File uploads              |
| cloudinary       | 2.7.0   | Cloud image storage       |
| ipfs-http-client | 56.0.3  | IPFS integration          |
| node-cron        | 4.2.1   | Scheduled tasks           |
| cors             | 2.8.5   | Enable CORS               |
| cookie-parser    | 1.4.7   | Cookie parsing            |
| nodemailer       | 7.0.4   | Email service             |

---

## Development Tools

| Tool    | Version | Purpose                        |
| ------- | ------- | ------------------------------ |
| nodemon | 3.1.10  | Auto-reload during development |

---

## Usage

After starting the server, you can access API endpoints such as:

* `POST /api/authentication/login` — User login
* `GET /api/product/get-all` — Get medicine list

---

## License

This project is licensed under the **ISC License**.

---

## Authors

Developed by **Anh** and the **Blockchain & Medication Team**.
