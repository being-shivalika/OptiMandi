# OptiMandi Maintenance Guide

## Before changing code
- [ ] Read this document.
- [ ] Read the README for architectural context.
- [ ] Verify `npm install` and `npm run dev` work cleanly.
- [ ] Ensure environment variables (`.env`) match the `.env.example` structure.

## Debugging workflow
1. **Reproduce**: Consistently trigger the issue.
2. **Inspect logs**: Check browser console, network tab, and backend Node.js terminal logs.
3. **Identify layer**: Is the bug in UI rendering, state management (DataContext/AuthContext), API parsing, Backend routing, or Database?
4. **Find root cause**: Trace back to where the data assumes an incorrect state.
5. **Fix**: Address the root cause cleanly.
6. **Test**: Verify the specific fix works.
7. **Verify regression**: Ensure adjacent functionality (e.g. file upload -> report generation) is not broken.

## Dependency updates
- Run `npm outdated` to see what is old.
- Do **not** blindly run `npm update` or `npm audit fix --force`.
- For each update: Verify current version -> target stable version -> breaking changes.
- Check React, Vite, and Express release notes for major breaking changes before upgrading.

## Environment variables
- `VITE_BACKEND_URL`: URL to the backend. Required for the frontend to communicate with the API.
- `MONGO_URI`: MongoDB connection string. Essential for backend startup.
- `JWT_SECRET`: Used for session signing. Essential for login/registration to work.
- `GEMINI_API_KEY`: Google Gemini API key. Needed for market report generation and chat insights.

## Deployment checklist
- [ ] `.env` variables are correctly set in the production environment (Vercel/Render).
- [ ] Backend is deployed and accessible via `VITE_BACKEND_URL`.
- [ ] CORS allowed origins in `Backend/app.js` include the new production URL.
- [ ] Build succeeds locally (`npm run build`).

## Database/API changes
- If modifying the user schema (`user.js`), ensure existing tokens/sessions are not invalidated improperly, or force a logout.
- If modifying API request/response structures, update both frontend API calls (`DataProvider.jsx`, `AuthContext.jsx`) and backend controllers simultaneously.

## Known limitations
- AI Insights gracefully degrade to stable/medium risk fallbacks if `GEMINI_API_KEY` is missing or if the API rate limits are hit.
- The system processes maximum 100 rows from uploaded CSVs to stay within Gemini token limits.

## Future technical debt
- Replace LocalStorage persistence in `DataProvider.jsx` with a robust backend syncing mechanism if real-time multi-device access is needed.
- Move towards a proper role-based access control (RBAC) if multiple types of users (e.g. Farmers vs. Admins) are introduced.
