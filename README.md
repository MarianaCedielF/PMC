# FreshKeeper 🥦

Bilingual (EN/ES) pantry management app. Helps households track food expiry, manage shopping lists, and reduce waste.

## Screens
- **Home** – Dashboard with stats, expiring items, zones, activity
- **Inventory** – Shared household shopping list
- **Add Product** – Scan barcode / photo / manual entry
- **Alerts** – Expiry notifications with recipe suggestions
- **Profile** – Members & invite management

## Local Development
```bash
npm install
npm run dev
```

## Deploy to Vercel via GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Vite** | Build command: `npm run build` | Output: `dist`
5. Click **Deploy** ✅

The `vercel.json` handles SPA routing automatically.
