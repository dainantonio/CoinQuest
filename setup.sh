#!/bin/bash

# COINQUEST PHASE 2 SETUP SCRIPT
# This automates Step 1 and Step 2 of the ROADMAP.md

echo "🚀 Starting CoinQuest Environment Setup..."

# 1. Create the React App (Step 1)
# We use 'vite' which is the modern standard for React
echo "📦 Scaffolding new Vite + React project..."
npm create vite@latest coin-quest -- --template react

# Move into the new folder
cd coin-quest

# 2. Install Dependencies (Step 1)
echo "📥 Installing dependencies..."
npm install
# Install the specific tools we need:
# - lucide-react: For icons
# - tailwindcss: For styling
# - firebase: For the database (Phase 2 requirement)
npm install lucide-react tailwindcss postcss autoprefixer firebase

# 3. Configure Tailwind CSS (Step 1)
echo "🎨 Initializing Tailwind CSS..."
npx tailwindcss init -p

# Overwrite tailwind.config.js with the correct settings for React
cat > tailwind.config.js <<EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Add Tailwind directives to index.css
cat > src/index.css <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f0f9ff; /* bg-slate-50 equivalent */
}
EOF

# 4. Create Folder Architecture (Step 2)
echo "📂 Creating folder structure..."
mkdir -p src/components/common
mkdir -p src/components/views
mkdir -p src/hooks
mkdir -p src/lib

# 5. Create Empty Component Files (Step 2)
# We create these now so you can just paste code into them later
echo "📝 Creating component placeholders..."

# Common Components
touch src/components/common/Header.jsx
touch src/components/common/Notification.jsx
touch src/components/common/BottomNav.jsx

# View Components
touch src/components/views/Dashboard.jsx
touch src/components/views/ParentDashboard.jsx
touch src/components/views/Earn.jsx
touch src/components/views/Invest.jsx
touch src/components/views/Shop.jsx
touch src/components/views/Give.jsx

# Logic & Database
touch src/hooks/useGameData.js
touch src/lib/firebase.js

echo "✅ SETUP COMPLETE!"
echo "------------------------------------------------"
echo "👉 NEXT STEP: Type 'cd coin-quest' to enter your folder."
echo "👉 THEN: Type 'npm run dev' to see your empty app running!"
echo "------------------------------------------------"