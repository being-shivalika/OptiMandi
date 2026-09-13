# OptiMandi Health Check
Use this checklist when returning to the project after a period of inactivity to quickly verify stability.

- [ ] Dependencies install (`npm install` in both Frontend and Backend)
- [ ] Development server starts (`npm run dev` in Frontend, `npm start` in Backend)
- [ ] Production build succeeds (`npm run build` in Frontend)
- [ ] Backend starts without crashing (even if `GEMINI_API_KEY` is missing)
- [ ] Database connects successfully (verified via backend console logs)
- [ ] Authentication works (Registration and Login flow successfully create/verify JWT tokens)
- [ ] Core workflow works (Uploading a CSV/PDF successfully updates the state)
- [ ] API requests work (Network requests to `/api/upload` and `/api/auth/*` return 2xx)
- [ ] No critical console errors (Check browser console during core workflows)
- [ ] No obvious security secrets exposed (Check `.env` isn't accidentally committed; no hardcoded keys)
- [ ] Deployment works (or build output `dist` is cleanly generated)
- [ ] Environment variables are configured (Match `.env.example`)
