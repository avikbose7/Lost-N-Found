# Render deployment guide — backend

Follow these steps to deploy the backend on Render as a Web Service.

1. Create the service
   - In Render, click **New** → **Web Service** and connect your GitHub repo.
   - For **Root Directory**, set: `backend`

2. Build & Start
   - Render will run `npm install` automatically in the `backend` directory.
   - Set the **Start Command** to:

```bash
npm start
```

3. Node version
   - The `backend/package.json` includes an `engines.node` entry (18.x). Render will respect this. You can also set the service to use Node 18 in Render's Environment settings.

4. Environment variables
   - Add the following in Render's dashboard (Environment → Environment Variables):
     - `MONGO_URI` — your MongoDB connection string
     - `CLIENT_URL` — the frontend URL (e.g., `https://username.github.io/repo-name` or your custom domain). This is used by the backend CORS configuration.
     - `JWT_SECRET` — (if your code uses JWT; set to your secret key)

5. Ports
   - Do not set a custom `PORT`; Render provides `PORT` automatically and the server reads `process.env.PORT`.

6. Deploy
   - Save and click **Create Web Service**. Render will deploy and show build logs.

7. Test locally
   - From the `backend` folder you can run:

```bash
npm run dev   # Uses nodemon for local development
# or
npm start     # Runs node index.js
```

Notes
 - Make sure `CLIENT_URL` on Render matches your frontend URL so CORS allows requests from your hosted frontend.
 - If you prefer building a container, choose Render's Docker option and provide a Dockerfile in `backend`.
