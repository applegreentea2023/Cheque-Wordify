<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio App - Cheque-Wordify

This repository contains the Cheque-Wordify project, built with React, Vite, and Tailwind CSS.

## 🚀 Setup & Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Rename `.env.example` to `.env` or `.env.local` and set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000` (or another available port).

4. **Build for Production:**
   ```bash
   npm run build
   ```
   Built assets will be output to the `dist` directory.

## 📦 Deployment

This project includes a **GitHub Actions workflow** (`.github/workflows/deploy.yml`) for automated deployment to **GitHub Pages**. 

- Pushing to the `main` or `master` branch will trigger the workflow.
- It will automatically build the React app and deploy the `dist/` folder.
- Ensure that GitHub Pages is enabled in your repository settings under **Settings > Pages** and set the source to **GitHub Actions**.

## 🛑 Important Ignored Files
The project is configured to ignore unnecessary and sensitive files, including:
- `node_modules/` & `dist/`
- `.env` & other local environment files (to prevent key leakages).
- Logs and cache files.
