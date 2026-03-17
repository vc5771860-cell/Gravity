# How to Deploy DevLearn Online Teaching Platform for Free

Now that the code is structured correctly, here is how you host the platform completely for free so it runs 24/7.

## Step 1: Push Code to GitHub
Both Vercel and Render deploy automatically from GitHub.
1. Create a new empty repository on your [GitHub](https://github.com/) account.
2. In this folder (`c:\Users\Swapnil Chaturvedi\.gemini\antigravity\scratch\abc`), run these commands in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial Platform Commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

## Step 2: Deploy the Signaling Server (Render)
This server handles the Socket.io WebRTC connections for video classes.
1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New +** and select **Web Service**.
3. Select your GitHub repository.
4. Set the following fields:
   - **Name:** devlearn-signaling (or anything you like)
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Create Web Service**.
6. Render will give you a live URL (e.g., `https://devlearn-signaling.onrender.com`). *Save this URL.*

## Step 3: Deploy the Next.js App (Vercel)
This serves the frontend UI and the database API routes.
1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import the same GitHub repository.
4. **Important Environment Variables:**
   - Under Environment Variables, add `DATABASE_URL`. Set the value to your Supabase PostgreSQL connection string.
   - Add `SESSION_SECRET` with a random long string (e.g., `my-super-secret-key-12345`).
   - Add `NEXT_PUBLIC_SOCKET_URL` and set its value to the URL you got from Render in Step 2.
5. Click **Deploy**. Vercel will automatically read the `vercel.json` file we created to generate the Prisma client during the build.

## Step 4: Link Frontend to Render
Currently, your local code hardcodes `http://localhost:3001` for the video sockets. You need to update `src/app/classroom/[id]/page.tsx` line 21:
```javascript
// Change this:
const socket = io("http://localhost:3001");
// To this:
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
```

Once you make that tiny change, commit it and push to GitHub, Vercel will automatically rebuild and your platform is officially live worldwide!
