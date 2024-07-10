# Job Board

## Overview
The Job Board is a platform for job listings, user profile management, advanced job search and filtering, application management, and notifications. It caters to job seekers and employers.

## Features

### 1. Job Listings
- Employers post job openings.
- Job seekers search job listings.

### 2. User Profiles
- Job seekers create profiles.
- Employers manage job postings

### 3. Search and Filters
- Search by job title, location, salary, etc.
- Filters for specific criteria.

### 4. Application Management
- Job seekers apply for jobs.
- Employers can see applications

### 5. Notifications
- Email confirmation for new applications.

## Tech Stack
- **Frontend:** React.js, Material UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas

## Routes

### User Routes
- Register: `POST /auth/signup`
- Login: `POST /users/login`
- Resume Upload: `POST /upload/resume`

### Jobs Routes (Recruiter)
- Create Job: `POST /recruiter/jobs/new`
- Get All Jobs: `GET /recruiter/jobs/all`
- Get Job by ID: `GET /recruiter/jobs/:id`
- Update Job: `PUT /recruiter/jobs/:id`
- Delete Job: `DELETE /recruiter/jobs/:id`

### Applications Routes
- Create Application: `POST /applications/new`
- Get All Applications: `GET /applications/all`
- Get Application by ID: `GET /applications/view/:id`
- Delete Application: `DELETE /applications/delete/:id`

## User Roles
- **Applicant:** Create, read, delete applications, view jobs, search and filter jobs.
- **Recruiter:** CRUD jobs, view posted jobs.

## Additional Technologies
- **Nodemailer:** Email confirmation.
- **Bcrypt:** Password encryption.
- **Multer:** Resume upload.
- **Cors**
- **Passport:** Authentication.
