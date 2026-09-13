# 🌾 OptiMandi – AI-Powered Agricultural Market Intelligence System

🔗 **Live Demo:** [https://opti-mandi.vercel.app/](https://opti-mandi.vercel.app/)

## Project Overview
OptiMandi is an AI-driven decision support system designed to optimize agricultural mandi (market) operations by transforming unstructured data into structured, actionable insights. It helps officials make faster and more accurate decisions regarding procurement, storage, and distribution using AI-based analysis.

## Architecture
- **Frontend**: React.js 19 with Vite, Tailwind CSS for styling, and React Router for SPA navigation. Context API (`AuthContext`, `DataContext`) manages authentication state and uploaded dataset persistence.
- **Backend**: Node.js and Express.js REST API. Handles data normalization, parsing, and integration with the Gemini API.
- **Database**: MongoDB for user data and authentication.
- **API Flow**: 
  - User uploads CSV/PDF -> Frontend sends to `/api/upload` -> Backend parses and validates -> Backend invokes Gemini API for insights -> JSON insights returned to Frontend -> Rendered in Dashboard/Reports.
- **Authentication**: JWT-based stateless authentication. Passwords hashed via `bcrypt`.

## Folder Structure
- `Frontend/` - React Application
  - `src/components/` - Reusable UI widgets.
  - `src/context/` - Global state management for User Data and Auth.
  - `src/pages/` - Page-level components.
- `Backend/` - Express API
  - `controller/` - API route handlers (Auth, Upload, AI).
  - `middleware/` - JWT Auth verification.
  - `models/` - Mongoose schemas (e.g., `user.js`).
  - `services/` - External integrations (Gemini AI parsing).
- `docs/` - Maintenance and Healthcheck guides.

## Installation
Ensure you have Node.js (v18+) and MongoDB installed.
```bash
# Clone the repository
git clone <repo-url>
cd OptiMandi

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

## Environment Setup
Create a `.env` file in both `Frontend` and `Backend` directories using the provided `.env.example` templates.

**Backend `.env`:**
```env
MONGO_URI=mongodb://localhost:27017/optimandi
JWT_SECRET=your_super_secret_key
PORT=8080
GEMINI_API_KEY=your_google_gemini_api_key
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:8080
```

## Development
Run both servers simultaneously in separate terminals:

```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

## Build
To build the frontend for production:
```bash
cd Frontend
npm run build
```
This generates optimized static files in the `Frontend/dist/` directory.

## Deployment
- **Frontend**: The `dist/` folder can be deployed to Vercel, Netlify, or any static hosting service. Ensure `VITE_BACKEND_URL` is set in the hosting provider's environment variables.
- **Backend**: Can be deployed to Render, Heroku, or an AWS EC2 instance. Ensure the host is added to the `allowedOrigins` array in `Backend/app.js` to prevent CORS issues. Set `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` securely.

## Troubleshooting
- **CORS Errors**: Check `Backend/app.js` -> `allowedOrigins`. Your frontend URL must be explicitly listed.
- **Database Connection Failed**: Ensure MongoDB is running and `MONGO_URI` is correct.
- **AI Analysis Failing**: Check `GEMINI_API_KEY` validity. The backend is configured to gracefully fallback to basic analytics if the AI service fails or key is missing.

## Common Commands
- `npm run dev`: Start dev server.
- `npm run build`: Create production build.
- `npm run lint`: Run ESLint on the codebase.

## Maintenance
Please refer to `docs/MAINTENANCE.md` and `docs/HEALTHCHECK.md` for guidelines on debugging and returning to the project after periods of inactivity.
