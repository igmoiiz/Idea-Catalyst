# IdeaCatalyst 🚀

IdeaCatalyst is a comprehensive platform designed for entrepreneurs and innovators to submit, explore, validate, and trade startup ideas. By leveraging advanced AI personas, the platform provides simulated feedback from various critical perspectives—from Venture Capitalists to Skeptical Customers—helping creators refine their concepts before hitting the market.

## ✨ Features

- **💡 Idea Submission & Management**: Users can submit detailed startup ideas, including problem statements, solutions, and target markets.
- **🤖 AI Persona Analysis**: Get instant, detailed feedback from AI-driven personas powered by Google Gemini:
  - **Venture Capitalist (VC)**: Analyzes scalability, unit economics, and moat.
  - **Skeptic**: rigorous critique focusing on market saturation and weaknesses.
  - **Potential Customer**: Evaluates user need, pricing, and usability.
  - **Project Manager**: Suggests implementation roadmaps and agile strategies.
  - **Market Analyst**: Identifies trends and competitive gaps.
  - **Team Builder**: Recommends ideal team composition for execution.
- **🛒 Idea Marketplace**: A platform to list, unlock, and trade validated ideas.
- **🔍 Explore & Community**: Browse a curated list of ideas from other innovators.
- **🔐 Secure Authentication**: Robust sign-up and sign-in flow with JWT authentication and email verification support.

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (Model: `gemini-pro`)
- **Authentication**: JWT (JSON Web Tokens) & BCrypt
- **Security**: Helmet, Rate Limiting, CORS

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB**: You need a running instance of MongoDB (Local or Atlas).
- **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd idea-catalyst
```

### 2. Backend Setup
The backend handles the API, database connection, and AI integration.

Navigate to the `api` folder:
```bash
cd api
```

Install dependencies:
```bash
npm install
```

**Configuration**: Create a `.env` file in the `api` root directory and add the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ideacatalyst  # Replace with your connection string

# Security
JWT_SECRET=your_secure_random_string_here

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Email (Optional - for verification features)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

Start the backend server:
```bash
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Frontend Setup
The frontend is the React user interface.

Open a new terminal and navigate to the project root (if you are inside `api`, go back one level):
```bash
cd ..
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*The application will open at `http://localhost:5173` (or similar).*

## 📂 Project Structure

```
idea-catalyst/
├── api/                        # Backend Node.js Application
│   ├── src/
│   │   ├── config/             # Configuration (DB, Security, Nodemailer)
│   │   ├── middleware/         # Custom Middleware (Auth, Rate Limiting)
│   │   ├── models/             # Mongoose Data Models (User, Idea, etc.)
│   │   ├── routes/             # API Route Definitions
│   │   ├── services/           # Business Logic & AI Integration
│   │   ├── system-prompts/     # Text prompts defining AI personas
│   │   └── index.js            # Server Entry Point
│   ├── .env                    # Environment Variables (Create this)
│   └── package.json
│
├── src/                        # Frontend React Application
│   ├── api/                    # Axios Configuration
│   ├── components/             # Reusable UI Components
│   ├── screens/                # Main Application Views (Pages)
│   ├── services/               # API Calls (Auth, etc.)
│   ├── App.tsx                 # Main Component & Routing Logic
│   └── main.tsx                # React Entry Point
│
├── package.json                # Frontend Dependencies
├── tailwind.config.js          # Tailwind Styling Configuration
├── tsconfig.json               # TypeScript Configuration
└── vite.config.ts              # Vite Configuration
```

## 🔌 API Overview
The backend provides a RESTful API. Key endpoints include:

- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`
- **Ideas**: `GET /api/ideas`, `POST /api/ideas`, `GET /api/ideas/:id`
- **Personas**: `POST /api/personas/analyze` (Requires idea context and persona type)
- **Marketplace**: `GET /api/marketplace/listings`

## 🤝 Contributing
Contributions are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
This project is licensed under the MIT License.
