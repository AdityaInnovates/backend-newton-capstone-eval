# Newton School Capstone Evaluation System - Backend

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Email Services](#email-services)
  - [Student Management](#student-management)
  - [File Upload](#file-upload)
- [Installation](#installation)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Project Overview

A backend system designed to manage and evaluate capstone projects for Newton School students. This system handles project submissions, evaluations, and feedback management.

## Features

- User Authentication (Students & Evaluators)
- Project Submission Management
- Evaluation Process
- Feedback System
- Grading System
- Report Generation

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for Authentication
- Nodemailer for Email Services
- Google Drive API for File Storage
- Multer for File Upload

## API Documentation

### Authentication

#### Register User

```http
POST /User/register-otp
```

**Request Body:**

```json
{
  "name": "John Doe",
  "mentorName": "Jane Smith",
  "email": "john@example.com",
  "password": "password123",
  "otp": "1234"
}
```

#### Login User

```http
POST /User/login
```

**Request Body:**

```json
{
  "usernameOrEmail": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile

```http
GET /User/me
```

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

#### Other Auth Routes

- `PUT /User/update-pass/:token` - Update password

**Request Body:**

```json
{
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Password updated successfully"
}
```

- `POST /AdminLogin` - Admin login

**Request Body:**

```json
{
  "email": "admin@newtonschool.com",
  "password": "admin123456"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Admin login successful",
  "token": "<jwt_token>"
}
```

### Email Services

#### Send OTP

```http
POST /sendMail/otp
```

**Request Body:**

```json
{
  "to": "user@example.com"
}
```

#### Send Password Reset Link

```http
POST /sendMail/forgetPass
```

**Request Body:**

```json
{
  "to": "user@example.com"
}
```

### Student Management

#### Get All Students

```http
GET /Studentlist
```

#### Add New Student

```http
POST /Studentlist
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "githubRepo": "https://github.com/user/repo",
  "hostedLink": "https://project.example.com",
  "query": "Project description",
  "video": "https://drive.google.com/file/...",
  "report": {}
}
```

### File Upload

#### Upload Video

```http
POST /UploadFile/upload
```

**Request Body (Form Data):**

- Key: `video`
- Value: File

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```env
   PORT=<port_number>
   SECRET_KEY=<your_secret_key>
   emailpass=<email_password>
   forgetPasswordHostedLink=<hosted_link>
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Contact

**Project Maintainers:**

- [Aditya Kumar](https://github.com/adityaInnovates)
- [Ved Pawar](https://github.com/vedpawar2254)

## Acknowledgments

- Newton School
- Project Mentors
- Contributors
