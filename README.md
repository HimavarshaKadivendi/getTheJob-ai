# GetTheJob AI

An AI-powered job preparation platform that helps users evaluate their resumes, prepare for interviews, and generate ATS-friendly resumes tailored to specific job descriptions.

The idea behind this project was to build a single platform where users can upload their resume, paste a job description, and receive actionable insights instead of manually preparing for every application.

---

## Features

- User Authentication using JWT and HTTP-only cookies
- Resume PDF Parsing
- AI-powered interview preparation using Google Gemini
- ATS Match Score Analysis
- Personalized Technical & Behavioral Interview Questions
- Skill Gap Analysis
- Customized Preparation Roadmap
- AI-generated ATS-friendly Resume
- Download Resume as PDF
- Cloud Deployment

---

## Tech Stack

### Frontend
- React
- Vite
- SCSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Puppeteer

### AI
- Google Gemini API

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

## 📂 Project Structure

```
getTheJob-ai/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── src/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/HimavarshaKadivendi/getTheJob-ai.git
```

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
GOOGLE_GENAI_API_KEY=YOUR_API_KEY
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run the backend

```bash
npm run dev
```

---

### Frontend

```bash
cd Frontend
npm install
```

Create a `.env`

```env
VITE_API_URL=http://localhost:3000
```

Run

```bash
npm run dev
```

---

## Deployment

Frontend is deployed on **Vercel**

Backend is deployed on **Render**

Database is hosted on **MongoDB Atlas**

---

## Workflow

1. Register/Login
2. Upload Resume
3. Paste Job Description
4. Add Self Description
5. Generate Interview Report
6. Review:
   - ATS Match Score
   - Skill Gaps
   - Technical Questions
   - Behavioral Questions
   - Preparation Plan
7. Generate & Download AI-tailored Resume

---

## Challenges Faced

Some of the interesting challenges while building this project were:

- Parsing resumes with different formats
- Prompt engineering for structured AI responses
- Validating AI output using Zod schemas
- Running Puppeteer on Render for server-side PDF generation
- Handling authentication using JWT and cookies across different domains
- Deploying a complete MERN application with cloud services

---

## Future Improvements

- Resume version history
- Multiple resume templates
- Interview practice chatbot
- Cover letter generation
- Job tracking dashboard
- OAuth (Google/GitHub Login)
- Admin analytics

---

## Author

**Kadivendi Himavarsha**

GitHub: https://github.com/HimavarshaKadivendi

---

If you found this project interesting, feel free to ⭐ the repository.
